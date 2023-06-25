import React, { Component } from "react";
import { navigate } from "@reach/router";

import "./Home.css";
import { get } from "jquery";
import CustomSelect from "../modules/Select";
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      module: this.props.module || "",
      submodules: [],
      submodule: this.props.submodule ? this.props.submodule.split(",").map(submodule_map) : [],
      backend: this.props.backend
        ? this.props.backend.replace(/:/g, "/").replace(/_/g, ".").split(",").map(fw_map)
        : [],
      frontend: this.props.frontend
        ? this.props.frontend.replace(/:/g, "/").replace(/_/g, ".").split(",").map(fw_map)
        : [],
      dashboard: [],
    };
    if (this.props.module) {
      this.handleModuleChange({ target: { value: this.props.module } });
    }
    if (this.props.backend) {
      this.handleSubmit();
    }
    this.dashboard_data = {};
    this.torch_versions = [
      "torch/latest-stable",
      "torch/1.4.0",
      "torch/1.5.0",
      "torch/1.10.1",
      "torch/1.10.2",
      "torch/1.11.0",
      "torch/1.12.0",
      "torch/1.12.1",
      "torch/1.13.0",
    ];
    this.tensorflow_versions = [
      "tensorflow/latest-stable",
      "tensorflow/2.2.0",
      "tensorflow/2.2.1",
      "tensorflow/2.2.2",
      "tensorflow/2.4.4",
      "tensorflow/2.9.0",
      "tensorflow/2.9.1",
      "tensorflow/2.9.2",
    ];
    this.jax_only_versions = [
      "jax/0.1.60",
      "jax/0.1.61",
      "jax/0.3.10",
      "jax/0.3.13",
      "jax/0.3.14",
      "jax/0.3.14",
      "jax/0.3.15",
      "jax/0.3.16",
      "jax/0.3.17",
    ];
    this.jaxlib_versions = [
      "jaxlib/0.1.50",
      "jaxlib/0.1.60",
      "jaxlib/0.1.61",
      "jaxlib/0.3.10",
      "jaxlib/0.3.14",
      "jaxlib/0.3.15",
      "jaxlib/0.3.20",
      "jaxlib/0.3.22",
    ];
    this.numpy_versions = [
      "numpy/latest-stable",
      "numpy/1.17.3",
      "numpy/1.17.4",
      "numpy/1.23.1",
      "numpy/1.24.0",
      "numpy/1.24.1",
      "numpy/1.24.2",
    ];
    this.paddle_versions = ["paddle/latest-stable"];
    this.jax_versions = ["jax/latest-stable"];
    for (const jax_ver of this.jax_only_versions) {
      for (const jaxlib_ver of this.jaxlib_versions) {
        this.jax_versions.push(jax_ver + "/" + jaxlib_ver);
      }
    }
    this.backend_versions = this.torch_versions.concat(
      this.tensorflow_versions,
      this.jax_versions,
      this.numpy_versions,
      this.paddle_versions
    );
    this.frontend_versions = this.backend_versions;

    this.modules = [
      "array_api",
      "core",
      "nn",
      "stateful",
      "tensorflow",
      "torch",
      "jax",
      "numpy",
      "paddle",
      "exp_core",
      "exp_nn",
      "misc",
    ];
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
    this.handleSubmoduleChange = this.handleSubmoduleChange.bind(this);
    this.handleModuleChange = this.handleModuleChange.bind(this);
    this.handleBackendChange = this.handleBackendChange.bind(this);
    this.handleBackendVersionChange = this.handleBackendVersionChange.bind(this);
    this.handleFrontendChange = this.handleFrontendChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const module = this.state.module;
    const submodule = this.state.submodule;
    const backend = this.state.backend;
    const frontend = this.state.frontend;

    if (
      prevState.module !== module ||
      prevState.submodule !== submodule ||
      prevState.backend !== backend ||
      prevState.frontend !== frontend
    ) {
      let newPath = `/${module}`;
      if (submodule.length !== 0) {
        console.log(submodule);
        const submodule_string = submodule.map(value_map).join(",");
        newPath += "/" + submodule_string;
        if (backend.length !== 0) {
          const backend_string = backend
            .map(value_map)
            .join(",")
            .replace(/\//g, ":")
            .replace(/\./g, "_");
          newPath += "/" + backend_string;
          if (frontend.length !== 0) {
            const frontend_string = frontend
              .map(value_map)
              .join(",")
              .replace(/\//g, ":")
              .replace(/\./g, "_");
            newPath += "/" + frontend_string;
          }
        }
      }
      navigate(newPath, { replace: true });
    }
  }

  handleModuleChange(event) {
    this.setState({ module: event.target.value });
    get("/api/submodules", { module: event.target.value }).then((submodules) => {
      let mod_submods = [];
      for (var submodule of submodules) {
        if (
          submodule != "_id" &&
          submodule != "numpy" &&
          submodule != "jax" &&
          submodule != "torch" &&
          submodule != "tensorflow" &&
          submodule != "paddle"
        ) {
          console.log(submodule);
          mod_submods.push(submodule);
        }
      }
      this.setState({ submodules: mod_submods });

      this.dashboard_data = submodules;
    });
  }

  handleSubmoduleChange(event) {
    this.setState({ submodule: event });
  }

  handleBackendChange(event) {
    console.log(event);
    this.setState({ backend: event });
  }

  handleBackendVersionChange(event) {
    this.setState({ backend_version: event.target.value });
    if (
      this.state.module == "jax" ||
      this.state.module == "numpy" ||
      this.state.module == "tensorflow" ||
      this.state.module == "torch" ||
      this.state.module == "paddle"
    ) {
      let frontend_vers = [];
      for (var version in this.dashboard_data[this.state.submodule][this.state.backend + "\n"][
        event.target.value
      ]) {
        frontend_vers.push(version);
      }
      this.setState({ frontend_versions: frontend_vers });
    }
  }

  handleFrontendChange(event) {
    this.setState({ frontend: event });
  }

  handleSubmit(event = null) {
    if (event) {
      event.preventDefault();
    }
    let backend = this.state.backend;
    if (!backend || backend.length === 0) {
      backend = [
        { value: "torch/latest-stable" },
        { value: "tensorflow/latest-stable" },
        { value: "numpy/latest-stable" },
        { value: "jax/latest-stable" },
        { value: "paddle/latest-stable" },
      ];
    }
    get("/api/data", {
      module: this.state.module,
      submodules: this.state.submodule,
      backends: backend,
      frontends: this.state.frontend,
    }).then((data) => {
      this.setState({ dashboard: data });
    });
  }

  render() {
    return (
      <>
        <div className="Home-container">
          <div className="Home-input">
            <form onSubmit={this.handleSubmit}>
              <div className="Home-select">
                <select value={this.state.module} onChange={this.handleModuleChange}>
                  <option value="Module">Module</option>
                  {this.modules.map((module) => (
                    <option value={module}>{this.module_map[module]}</option>
                  ))}
                </select>
              </div>
              <CustomSelect
                value={this.state.submodule}
                handleChange={this.handleSubmoduleChange}
                options={this.state.submodules.map(submodule_map)}
                name="Submodule"
              />

              <CustomSelect
                value={this.state.backend}
                handleChange={this.handleBackendChange}
                options={this.backend_versions.map(fw_map)}
                name="Backend"
              />

              {FRONTEND_MODULES.includes(this.state.module) ? (
                <CustomSelect
                  value={this.state.frontend}
                  handleChange={this.handleFrontendChange}
                  options={this.frontend_versions
                    .filter((item) => item.startsWith(this.state.module))
                    .map(fw_map)}
                  name="Frontend"
                />
              ) : null}

              <input type="submit" value="Submit" />
            </form>
          </div>

          <NestedTreeViewTable data={this.state.dashboard} module={this.state.module} />
        </div>
      </>
    );
  }
}

export default Home;
