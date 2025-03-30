import {initDefault} from "../../common.js";
import ConceptLearning from "../ConceptLearning.js";

let root;
let conceptLearning;

window.addEventListener('script-loaded', async function (ev) {
    if (root)
        return;
    root = initDefault(ev);
    conceptLearning = new ConceptLearning(root);
});