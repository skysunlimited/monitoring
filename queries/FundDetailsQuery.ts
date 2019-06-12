import gql from 'graphql-tag';

export const FundDetailsQuery = gql`
  query FundDetailsQuery($fund: ID!) {
    fund(id: $fund) {
      id
      name
      createdAt
      isShutdown
      shutdownAt
      manager {
        id
      }
      version {
        name
      }
      gav
      nav
      totalSupply
      sharePrice
      calculationsHistory(orderBy: timestamp) {
        gav
        nav
        totalSupply
        feesInDenominationAsset
        sharePrice
        timestamp
      }
      investmentHistory(orderBy: timestamp) {
        action
        timestamp
        shares
        sharePrice
        amount
        amountInDenominationAsset
        owner {
          id
        }
        asset {
          id
          symbol
        }
      }
      holdingsHistory(orderBy: timestamp) {
        timestamp
        amount
        assetGav
        asset {
          id
          symbol
        }
      }
      currentHoldings: holdingsHistory(orderBy: timestamp, orderDirection: desc, first: 12) {
        timestamp
        amount
        assetGav
        asset {
          id
          symbol
        }
      }
      investments {
        shares
        owner {
          id
        }
      }
      feeManager {
        id
        managementFee {
          managementFeeRate
        }
        performanceFee {
          performanceFeeRate
          performanceFeePeriod
        }
        feeRewardHistory {
          timestamp
          shares
        }
      }
      policyManager {
        id
        policies {
          identifier
          position
          identifier
          assetWhiteList {
            symbol
          }
          assetBlackList {
            symbol
          }
          maxConcentration
          maxPositions
          priceTolerance
        }
      }
      accounting {
        id
        denominationAsset {
          symbol
        }
      }
      participation {
        id
      }
      share {
        id
      }
      trading {
        id
        calls(orderBy: timestamp, orderDirection: "desc") {
          timestamp
          exchange {
            id
            name
          }
          orderAddress2 {
            symbol
          }
          orderAddress3 {
            symbol
          }
          orderValue0
          orderValue1
          orderValue6
          methodSignature
        }
      }
      vault {
        id
      }
    }

    assets {
      id
      symbol
    }
  }
`;

export const FundHoldingsHistoryQuery = gql`
  query FundHoldingsHistoryQuery($id: ID!, $limit: Int!, $skip: Int!) {
    fundHoldingsHistories(where: { fund: $id }, orderBy: timestamp, first: $limit, skip: $skip) {
      timestamp
      amount
      assetGav
      asset {
        id
        symbol
      }
    }
  }
`;
