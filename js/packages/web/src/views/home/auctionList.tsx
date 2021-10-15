import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs, Button, Divider } from 'antd';
import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import Masonry from 'react-masonry-css';
import { Link } from 'react-router-dom';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { CardLoader } from '../../components/MyLoader';
import { PreSaleBanner } from '../../components/PreSaleBanner';
import { useMeta } from '../../contexts';
import { AuctionView, AuctionViewState, useAuctions } from '../../hooks';
import { PerformancesView } from '..';
import { ConnectButton } from '@oyster/common';

const { TabPane } = Tabs;

const { Content } = Layout;

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

export const AuctionListView = () => {
  const auctions = useAuctions(AuctionViewState.Live);
  const auctionsEnded = [
    ...useAuctions(AuctionViewState.Ended),
    ...useAuctions(AuctionViewState.BuyNow),
  ];
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading } = useMeta();
  const { connected, publicKey } = useWallet();
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Check if the auction is primary sale or not
  const checkPrimarySale = (auc: AuctionView) => {
    var flag = 0;
    auc.items.forEach(i => {
      i.forEach(j => {
        if (j.metadata.info.primarySaleHappened == true) {
          flag = 1;
          return true;
        }
      });
      if (flag == 1) return true;
    });
    if (flag == 1) return true;
    else return false;
  };

  const resaleAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(m => checkPrimarySale(m) == true);

  // Removed resales from live auctions
  const liveAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(a => !resaleAuctions.includes(a));

  const asStr = publicKey?.toBase58();
  const participated = useMemo(
    () =>
      liveAuctions
        .concat(auctionsEnded)
        .filter((m, idx) =>
          m.auction.info.bidState.bids.find(b => b.key == asStr),
        ),
    [publicKey, auctionsEnded.length],
  );
  let items = liveAuctions;
  switch (activeKey) {
    case LiveAuctionViewState.All:
      items = liveAuctions;
      break;
    case LiveAuctionViewState.Participated:
      items = participated;
      break;
    case LiveAuctionViewState.Resale:
      items = resaleAuctions;
      break;
    case LiveAuctionViewState.Ended:
      items = auctionsEnded;
      break;
  }

  const heroAuction = useMemo(
    () =>
      auctions.filter(a => {
        // const now = moment().unix();
        return !a.auction.info.ended() && !resaleAuctions.includes(a);
        // filter out auction for banner that are further than 30 days in the future
        // return Math.floor(delta / 86400) <= 30;
      })?.[0],
    [auctions],
  );

  const liveAuctionsView = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {!isLoading
        ? items.map((m, idx) => {
            if (m === heroAuction) {
              return;
            }

            const id = m.auction.pubkey;
            return (
              <Link to={`/auction/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </Masonry>
  );
  const endedAuctions = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {!isLoading
        ? auctionsEnded.map((m, idx) => {
            if (m === heroAuction) {
              return;
            }

            const id = m.auction.pubkey;
            return (
              <Link to={`/auction/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </Masonry>
  );

  return (
    <>

      <Col style={{ width: '100%', marginTop: 10, marginLeft: 20 }}>
        <span className='title'>
          Create your performance project and get instant funding
        </span>

        <br />
        <h3 style={{ marginLeft: 10 }}>The most innovative way for funding artists performance and record projects.</h3>
        <h3 style={{ marginLeft: 10 }}>Private investors can joing the campaign to get monthly yield from artists generated profitable incomes! </h3>
        <h3 style={{ marginLeft: 10 }}>Secured profit estimated in percentage based on the profitable performing projects.</h3>
        <br />
        
        {connected ? (
          <span className='title'>
            <Button
              type="primary"
              size="large"
              href="#/art/create/0"
              style={{ marginTop: 24, width: 200, color: 'white', paddingTop: '19px !important' }}
              className="action-btn"
            >
              Create a Project
            </Button>
          </span>
        ) : (
          <ConnectButton
            type="primary"
            size="large"
            style={{ marginTop: 24, width: 200 }}
            className="action-btn"
          />
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
        <div style={{ textAlign: 'center' }}>
          <PerformancesView />
        </div>
        <br />
        <br />
        <br />
        <br />
        <span className='title'>
          Roadmap
        </span>
        <Divider />
        <br />
        <br />
        <br />
        <br />
        <div style={{ textAlign: 'center' }}>
          <img src='/img/roadmap.png' width='80%' />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <span className='title'>
          Our Team
        </span>
        <Divider />
        <div style={{ textAlign: 'left', margin: -30 -50 }}>
          <a href="mailto:samuelbg04@gmail.com?subject=PerforMint">
            <img src='/img/contacts-img.png' width='60%' />
          </a>
        </div>
      </Col>
      <PreSaleBanner auction={heroAuction} />
      <Layout>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <p>
                <br />
                Contact
              </p>
              <a href="mailto:samuelbg04@gmail.com?subject=PerforMint">samuelbg04@gmail.com</a>
            </div>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
