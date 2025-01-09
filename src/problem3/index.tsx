// @ts-nocheck

interface WalletBalance {
  currency: string;
  amount: number;
  // Missing the blockchain property here
}

// Can be simplified this interface to FormattedWalletBalance to extend from WalletBalance
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Should not use any type here, should be specific type to string
  // Move this function to the top of the file because it is pure function
  // Can be improve this function to use a record object instead of switch case to reduce the lines of code, better readability and performance
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      // Zilliqa and Neo have the same priority value, which can result in an ambiguous order later on, they should be assigned distinct priority values
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    // The 'balances' may return undefined, which can cause a runtime error, should check if the value is undefined before using it

    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Incorrect variable name, should be balancePriority
        if (lhsPriority > -99) {
          // Incorrect condition, should be balance.amount > 0, and no need to use double 'if' statement here, use && operator instead in one 'if' statement
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Missing return 0 here, in case that leftPriority and rightPriority are equal
      });
  }, [balances, prices]); // The 'prices' dependency is not used in the useMemo callback, it should be removed

  // The extra variable is unnecessary; this can be simplified by directly using the array map in the sortedBalances above
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // The variable 'sortedBalances' is incorrectly used here; it should be 'formattedBalances' instead.
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount; // The 'prices' may return undefined, which can cause a runtime error, should check if the value is undefined before using it
    return (
      <WalletRow
        className={classes.row}
        key={index} // It is better to use a unique identifier from the balance object, such as balance.currency
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      ></WalletRow>
    );
  });

  return <div {...rest}>{rows}</div>;
};

////////////////////////////
///// IMPROVED VERSION /////
////////////////////////////

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  return (
    {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 10,
    }[blockchain] || -99
  );
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances: Array<FormattedWalletBalance> = useMemo(() => {
    if (!balances) return []; // Check if 'balances' is undefined, return an empty array

    return balances
      .filter((balance: WalletBalance) => {
        const chainPriority = getPriority(balance.blockchain);
        return chainPriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      })
      .map((balance: WalletBalance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
        };
      });
  }, [balances]);

  const renderRows = sortedBalances.map((balance: FormattedWalletBalance) => {
    const currencyPrice = prices?.[balance.currency] || 0;
    const usdValue = currencyPrice * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      ></WalletRow>
    );
  });

  return <div {...rest}>{renderRows}</div>;
};
