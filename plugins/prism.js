import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

export default (context, inject) => {
  inject("prism", Prism);
};
