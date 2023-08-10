import React, { Component } from "react";
import { navigate } from "@reach/router";

import "./Priority.css";
import { get } from "jquery";
import NestedTreeViewTable from "../modules/NestedTreeViewTable";

const FRONTEND_MODULES = ["numpy", "torch", "tensorflow", "paddle", "jax"];

function framework_map(framework_version) {
  var lst = framework_version.split("/");
  var lst_capitalized = [];

  var framework_map = {
    numpy: "NumPy",
    torch: "PyTorch",
    jax: "JAX",
    tensorflow: "TensorFlow",
    paddle: "PaddlePaddle",
  };

  lst[0] = framework_map[lst[0]];
  for (const str of lst) {
    lst_capitalized.push(str.charAt(0).toUpperCase() + str.slice(1));
  }
  if (lst_capitalized.length == 2) {
    return lst_capitalized[0] + ": " + lst_capitalized[1];
  }
  return (
    lst_capitalized[0] +
    ": " +
    lst_capitalized[1] +
    ", " +
    lst_capitalized[2] +
    ": " +
    lst_capitalized[3]
  );
}

const fw_map = (fw) => ({
  value: fw,
  label: framework_map(fw),
});

const submodule_map = (submodule) => ({
  value: submodule,
  label: submodule.charAt(0).toUpperCase() + submodule.slice(1),
});

const value_map = (options) => options.value;

class Priority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboards: [],
    };
    this.module_map = {
      array_api: "Array API",
      core: "Functional Core",
      nn: "Functional NN",
      stateful: "Stateful",
      tensorflow: "TensorFlow Frontend",
      torch: "PyTorch Frontend",
      jax: "JAX Frontend",
      numpy: "NumPy Frontend",
      paddle: "PaddlePaddle Frontend",
      exp_core: "Experimental Core",
      exp_nn: "Experimental NN",
      misc: "Miscellaneous",
    };
  }

  componentDidMount() {
    get("/api/priority").then((data) => {
      this.setState({ dashboards: data });
    });
  }

  render() {
    return (
      <>
        <div className="Priority-dashboards">
          {this.state.dashboards.map((item) => (
            <NestedTreeViewTable
              data={item.dashboard}
              module={item.module}
              display_module={this.state.dashboards.length > 1}
              module_map={this.module_map}
              with_device={true}
            />
          ))}
        </div>
      </>
    );
  }
}

export default Priority;
