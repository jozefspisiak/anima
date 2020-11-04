import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Prismic from "prismic-javascript";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";

import styles from "../styles/Home.module.css";
import { filterItemsByQuery } from "../src/helpers/utils";

import { Client } from "../src/api/prismic-configuration";
import Filters from "../src/components/Filters";

export const getStaticProps = async (context) => {
  const req = context.req;
  const items = await Client(req).query(
    Prismic.Predicates.at("document.type", "items")
  );

  return {
    props: {
      items,
    },
  };
};

const cache = new CellMeasurerCache({
  defaultHeight: 230,
  defaultWidth: 230,
  fixedWidth: true,
});

const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 3,
  columnWidth: 230,
  spacer: 10,
});

function Home({ items }) {
  const router = useRouter();

  const { query } = router;

  const itemsFiltered = filterItemsByQuery(items, query);

  function cellRenderer({ index, key, parent, style }) {
    const item = itemsFiltered[index];

    return (
      item && (
        <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
          <div style={style}>
            <img
              src={item.data.image.url}
              style={{
                width: item.data.image.dimensions.width / 2,
                height: item.data.image.dimensions.height / 2,
              }}
            />
            <h4>{item.data.name.value}</h4>
          </div>
        </CellMeasurer>
      )
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Anima Item Databasea</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to unofficial{" "}
          <a target="_blank" href="https://www.animathegame.com/">
            Anima
          </a>{" "}
          Item Database!
        </h1>

        <p className={styles.description}>
          Get started by selecting filters below
        </p>

        <Filters />
      </main>
      <div className={styles.items}>
        {items && (
          <AutoSizer defaultHeight={800} defaultWidth={1000}>
            {({ height, width }) => {
              if (!width || !height) {
                //dont try to correct
                return <div>Loading ...</div>;
              }
              return (
                <Masonry
                  cellCount={itemsFiltered.length}
                  cellMeasurerCache={cache}
                  cellPositioner={cellPositioner}
                  cellRenderer={cellRenderer}
                  height={height}
                  width={width}
                />
              );
            }}
          </AutoSizer>
        )}
      </div>

      <footer className={styles.footer}>
        <a href="https://spiso.sk" target="_blank" rel="noopener noreferrer">
          Created by Spiso
        </a>
      </footer>
    </div>
  );
}

export default Home;
