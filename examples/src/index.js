import React from "react";
import { render } from "react-dom";
import ReactDragCrop from "../../src";
const App = () => (
  <ReactDragCrop
    src="https://cdn-images-1.medium.com/max/2000/1*pebHcMtkJzOlopMuQfKtEA.jpeg"
    rounded={true}
    crop={{
      aspect:1
    }}
  />
);
render(<App />, document.getElementById("root"));
