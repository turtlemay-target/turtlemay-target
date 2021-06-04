import { waitForElement } from "../lib/util";

waitForElement("#adContainer").then((el) => el.remove());
