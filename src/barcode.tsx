// barcode.tsx

import * as React from "react";
import JsBarcode from "jsbarcode";
import type { IItemInfo } from "../types";

export function BarcodeApp() {
  const [itemInfo, setItemInfo] = React.useState(extractItemInfo(document.body.textContent));
  const [itemInfoProp, setItemInfoProp] = React.useState("upc");
  const prevLocation = React.useRef(location.href);

  React.useEffect(initObserver, []);
  React.useEffect(update, [location.href]);

  if (itemInfo) {
    return (
      <div className="turtlemay__barcodeWidget">
        <div className="turtlemay__barcodeWidgetTabs">
          <BarcodeTab propName="upc" />
          <BarcodeTab propName="dpci" />
          <BarcodeTab propName="tcin" />
        </div>
        <div className="turtlemay__barcodeWidgetBarcodeContainer">
          <Barcode className="turtlemay__barcodeWidgetBarcode" itemInfo={{ upc: itemInfo.upc, dpci: itemInfo.dpci, tcin: itemInfo.tcin }} />
        </div>
      </div>
    );
  }

  return null;

  function BarcodeTab(o: { propName: string }) {
    if (!itemInfo?.[o.propName]) {
      return null;
    } else return (
      <a data-turtlemay-active={itemInfoProp === o.propName || null} onClick={() => setItemInfoProp(o.propName)}>
        {o.propName.toUpperCase()}
      </a>
    );
  }

  function initObserver() {
    const observer = new MutationObserver((mutations) => {
      // Detect changed location.
      if (location.href !== prevLocation.current) {
        prevLocation.current = location.href;
        setItemInfo(extractItemInfo(document.body.textContent));
      }

      expandSpecifications();

      for (const mutation of mutations) {
        // Detect selected item variation.
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-label" &&
          mutation.target instanceof HTMLElement &&
          mutation.target.getAttribute("aria-label")?.includes("pressed")
        ) {
          setItemInfo(extractItemInfo(document.body.textContent));
          break;
        }

        // Detect changed product details.
        if (mutation.target instanceof HTMLElement) {
          const productDetailRootSelectors = [
            "#product-detail-tabs",
            "#tabContent-tab-Details",
            "#specAndDescript",
            `[data-test="detailsTab"]`,
            `[data-test="item-details-specifications"]`,
          ];
          if (mutation.target.querySelector(productDetailRootSelectors.join(", "))) {
            setItemInfo(extractItemInfo(mutation.target.textContent));
            break;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }

  function update() {
    setItemInfo(extractItemInfo(document.body.textContent));
  }
}

export function Barcode(props: { className?: string; itemInfo: IItemInfo | null }) {
  const elemRef = React.createRef<HTMLCanvasElement>();

  React.useEffect(update, [
    props.itemInfo?.upc,
    props.itemInfo?.dpci,
    props.itemInfo?.tcin,
  ]);

  function update() {
    let format = "code128";
    let value: string | undefined;

    if (props.itemInfo?.upc) {
      if (props.itemInfo.upc.length === 12) format = "upc";
      if (props.itemInfo.upc.length === 13) format = "ean13";
      value = props.itemInfo.upc;
    } else if (props.itemInfo?.dpci) {
      value = props.itemInfo.dpci;
    } else if (props.itemInfo?.tcin) {
      value = props.itemInfo.tcin;
    }

    if (value) {
      JsBarcode(elemRef.current as HTMLCanvasElement, value, {
        format: format,
        width: 2,
        height: 20,
        // Other barcode options
      });
    } else {
      // Handle the case where value is undefined
      console.error("Value is undefined. Cannot render barcode.");
    } 
  }

  return React.createElement("canvas", {
    className: `${props.className ?? ""} turtlemay__enterAnimation`,
    key: props.itemInfo?.upc ?? props.itemInfo?.dpci ?? props.itemInfo?.tcin,
    ref: elemRef,
    onClick: scrollToItemInfo,
  });
}

export function isProductPage() {
  return Boolean(
    location.pathname.startsWith("/p") ||
    document.querySelector(`meta[content="product"]`)
  );
}

export function expandSpecifications() {
  const expandableElems = document.querySelectorAll<HTMLElement>("[aria-expanded='false'] h3");
  const clickEl = Array.from(expandableElems).find(v => v.textContent === "Specifications");
  clickEl?.click();
}

export function scrollToItemInfo() {
  const elems = document.querySelectorAll<HTMLElement>("[data-test='item-details-specifications'] b");

  // We will play an animation to draw attention to these.
  const highlightElems = Array.from(elems).filter(v => {
    if (v.textContent === "UPC") return true;
    if (v.textContent === "TCIN") return true;
    if (v.textContent?.includes("DPCI")) return true;
    return false;
  });

  const scrollToEl = highlightElems[0];
  scrollToEl?.scrollIntoView({ block: "center" });

  for (const el of highlightElems) {
    // Apply CSS animation.
    el.classList.add("turtlemay__attentionTextAnimation");

    // CSS animation only works on block elements.
    if (el.style.display === "inline")
      el.style.display = "inline-block";

    // Reset animation.
    el.offsetWidth;
    el.style.animation = "";
  }
}

export function extractItemInfo(str: string | null): IItemInfo | null {
  const foundItemInfo: IItemInfo = {
    upc: matchUPC(str),
    dpci: matchDPCI(str),
    tcin: matchTCIN(str),
  };
  if (foundItemInfo.upc || foundItemInfo.dpci || foundItemInfo.tcin) {
    return foundItemInfo;
  } else {
    return null;
  }
}

export function matchUPC(str: string | null): string | null {
  return str?.match(/UPC:\ (\d{12,13})/)?.[1] || null;
}

export function matchDPCI(str: string | null): string | null {
  return str?.match(/\(?DPCI\)?:\ (\d+-\d+-\d+)/)?.[1] || null;
}

export function matchTCIN(str: string | null): string | null {
  return str?.match(/TCIN:\ (\d+)/)?.[1] || null;
}