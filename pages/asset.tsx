import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';
import AssetDetailsQuery from '~/queries/AssetDetailsQuery';
import { createToken, toFixed, createQuantity } from '@melonproject/token-math';

const styles: StyleRulesCallback = theme => ({});

type AssetProps = WithStyles<typeof styles>;

const Asset: React.FunctionComponent<AssetProps> = props => {
  const router = useRouter();
  const result = useQuery(AssetDetailsQuery, {
    ssr: false,
    variables: {
      asset: router.query.address,
    },
  });

  const asset = result.data && result.data.asset;

  const token = asset && createToken(asset.symbol, undefined, 18);

  const priceUpdates =
    asset &&
    asset.priceUpdates.map(item => {
      return {
        timestamp: item.timestamp,
        price: toFixed(createQuantity(token, item.price)),
      };
    });

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        {asset && (
          <>
            <div>Address: {asset.id}</div>
            <div>Symbol: {asset.symbol}</div>
          </>
        )}
      </Grid>
      <Grid item={true} xs={12}>
        <ResponsiveContainer height={200} width="80%">
          <LineChart width={400} height={400} data={priceUpdates}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Asset);
