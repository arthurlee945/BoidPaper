import type { PlopTypes } from "@turbo/gen";
import { initPkgGenerator } from "./generators/initPkgGenerator";

export default function generator(plop: PlopTypes.NodePlopAPI) {
    initPkgGenerator(plop);
}
