import React from 'react';
import * as R from 'ramda';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import TimeSeriesChart from '../TimeSeriesChart';
import { FundHoldingsHistoryQuery } from '~/queries/FundDetailsQuery';
import { formatBigNumber } from '~/utils/formatBigNumber';

export interface FundHoldingsChartProps {
  fundAddres: string;
  assets: string[];
  yMax: number;
}

const styles: StyleRulesCallback = theme => ({});

const FundHoldingsChart: React.FunctionComponent<FundHoldingsChartProps> = props => {
  const result =
    props.assets &&
    useScrapingQuery([FundHoldingsHistoryQuery, FundHoldingsHistoryQuery], proceedPaths(['fundHoldingsHistories']), {
      ssr: false,
      variables: { id: props.fundAddres },
    });

  const holdingsHistory = R.pathOr([], ['data', 'fundHoldingsHistories'], result);
  const holdingsLength = holdingsHistory && holdingsHistory.length;

  const groupedHoldingsHistory: any[] = [];
  let ts = 0;
  for (let k = 0; k < holdingsLength; k++) {
    if (ts !== holdingsHistory[k].timestamp) {
      groupedHoldingsHistory.push({
        timestamp: holdingsHistory[k].timestamp,
        [holdingsHistory[k].asset.symbol]: formatBigNumber(
          holdingsHistory[k].assetGav,
          holdingsHistory[k].asset.decimals,
          3,
        ),
      });
      ts = holdingsHistory[k].timestamp;
    } else {
      groupedHoldingsHistory[groupedHoldingsHistory.length - 1][holdingsHistory[k].asset.symbol] = formatBigNumber(
        holdingsHistory[k].assetGav,
        holdingsHistory[k].asset.decimals,
      );
    }
  }

  return (
    <TimeSeriesChart data={groupedHoldingsHistory} dataKeys={props.assets} yMax={props.yMax} loading={result.loading} />
  );
};

export default withStyles(styles)(FundHoldingsChart);
