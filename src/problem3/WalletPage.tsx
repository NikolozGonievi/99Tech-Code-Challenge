interface WalletBalance {
  // Added blockchain because it is referenced by sorting and filtering logic
  // but was missing from the original type definition.
  blockchain: string;
  currency: string;
  amount: number;
}

// Better to extend WalletBalance with a formatted property for display purposes
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// As Props interface does not add any additional properties,
// we can directly use BoxProps for the WalletPage component.
// Assuming that BoxProps is imported from somewhere in the codebase,
// otherwise it should be defined or imported appropriately.
type Props = BoxProps;

export const WalletPage: React.FC<Props> = (props: Props) => {
  // Removed the children prop from props since it's unused.
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Changing type of blockchain to string in getPriority function to avoid using 'any' type.
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        // Replacing the lhsPriorty with balancePriority to avoid using an undefined variable.
        // Fixed inverted filtering logic:
        // keep only supported blockchains with positive balances.
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Adding missing return statement to ensure that the sort function works correctly
        // when priorities are equal.
        return 0;
      });
    // Removing prices from the dependency array since it's not used in the sorting logic.
  }, [balances]);

  // Adding the useMemo hook to format the balances for display purposes,
  // memoizing the result to avoid unnecessary recalculations when prices change.
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    });
  }, [sortedBalances]);

  // Replacing sortedBalances with formattedBalances in the rows mapping to ensure
  // that the formatted property is used for display.
  // Also wrapping adding the use of useMemo to avoid unnecessary recalculations when prices change.
  const rows = useMemo(() => {
    return formattedBalances.map(
      // Using the index as a key is not ideal.
      // Removing the use of index as a key and using combination of balance.blockchain and balance.currency 
      // instead for better performance and to avoid potential issues with reordering.
      (balance: FormattedWalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            // Assuming that classes.row is a string
            // and classes is imported or defined elsewhere in your codebase.
            className={classes.row}
            key={`${balance.blockchain}-${balance.currency}`}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      },
    );
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
