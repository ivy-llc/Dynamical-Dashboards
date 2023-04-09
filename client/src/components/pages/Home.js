import React, { Component } from "react";

import "./Home.css";
import { get } from "jquery";
// import Select from "react-select";
import CustomSelect from "../modules/Select";
import NestedTable from "../modules/NestedTable";
import NestedTreeView from "../modules/NestedTreeView";
import NestedTreeViewTable from "../modules/NestedTreeViewTable";
function framework_map(framework_version) {
  var lst = framework_version.split("/");
  var lst_capitalized = [];

  var framework_map = {
    numpy: "NumPy",
    torch: "PyTorch",
    jax: "JAX",
    tensorflow: "TensorFlow",
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      module: this.props.module || "",
      submodules: [],
      backend_versions: ["Latest-stable"],
      frontend_versions: ["Latest-stable"],
      submodule: this.props.submodule ? this.props.submodule.split(",") : [],
      backend: this.props.backend ? this.props.backend.split(",") : [],
      backend_version: "",
      frontend: this.props.frontend ? this.props.frontend.split(",") : [],
      frontend_version: "",
      dashboard: [],
    };
    this.dashboard_data = {};
    this.torch_versions = [
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
      "tensorflow/2.2.0",
      "tensorflow/2.2.1",
      "tensorflow/2.2.2",
      "tensorflow/2.4.4",
      "tensorflow/2.9.0",
      "tensorflow/2.9.1",
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
      "numpy/1.17.3",
      "numpy/1.17.4",
      "numpy/1.23.1",
      "numpy/1.24.0",
      "numpy/1.24.1",
      "numpy/1.24.2",
    ];
    this.jax_versions = [];
    for (const jax_ver of this.jax_only_versions) {
      for (const jaxlib_ver of this.jaxlib_versions) {
        this.jax_versions.push(jax_ver + "/" + jaxlib_ver);
      }
    }
    this.backend_versions = this.torch_versions.concat(
      this.torch_versions,
      this.tensorflow_versions,
      this.jax_versions,
      this.numpy_versions
    );
    this.frontend_versions = this.backend_versions;
    // console.log(this.torch_versions);
    // console.log(this.tensorflow_versions);
    // console.log(this.jax_versions);
    // console.log(this.numpy_versions);

    this.modules = [
      "array_api",
      "core",
      "nn",
      "stateful",
      "tensorflow",
      "torch",
      "jax",
      "numpy",
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
      exp_core: "Experimental Core",
      exp_nn: "Experimental NN",
      misc: "Miscellaneous",
    };
    this.backends = ["numpy", "torch", "jax", "tensorflow"];
    this.handleSubmoduleChange = this.handleSubmoduleChange.bind(this);
    this.handleModuleChange = this.handleModuleChange.bind(this);
    this.handleBackendChange = this.handleBackendChange.bind(this);
    this.handleBackendVersionChange = this.handleBackendVersionChange.bind(this);
    this.handleFrontendChange = this.handleFrontendChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          submodule != "tensorflow"
        ) {
          console.log(submodule);
          mod_submods.push(submodule);
        }
      }
      this.setState({ submodules: mod_submods });
      console.log(
        mod_submods.map((submodule) => ({
          value: submodule,
          label: submodule.charAt(0).toUpperCase() + submodule.slice(1),
        }))
      );
      this.dashboard_data = submodules;
    });
  }

  handleSubmoduleChange(event) {
    console.log(event);
    console.log(event.map((option) => option.value));
    this.setState({ submodule: event });
  }

  handleBackendChange(event) {
    console.log(event);
    this.setState({ backend: event });
    // Get all the backend_versions
    // let backend_vers = [];
    // console.log("here!");
    // console.log(this.dashboard_data);
    // console.log(this.dashboard_data[this.state.submodule]);
    // console.log(this.state.backend);
    // console.log(this.dashboard_data[this.state.submodule][event.target.value + "\n"]);
    // for (var version in this.dashboard_data[this.state.submodule][event.target.value + "\n"]) {
    //   backend_vers.push(version);
    // }
    // console.log(backend_vers);
    // this.setState({ backend_versions: backend_vers });
  }

  handleBackendVersionChange(event) {
    this.setState({ backend_version: event.target.value });
    if (
      this.state.module == "jax" ||
      this.state.module == "numpy" ||
      this.state.module == "tensorflow" ||
      this.state.module == "torch"
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
    console.log(event);
    this.setState({ frontend: event });
  }

  handleSubmit(event) {
    event.preventDefault();
    get("/api/data", {
      module: this.state.module,
      submodules: this.state.submodule,
      backends: this.state.backend,
      frontends: this.state.frontend,
    }).then((data) => {
      this.setState({ dashboard: data });
    });
    // var data = [];
    // console.log(this.dashboard_data);
    // var dash_data;
    // if (this.state.module == "array_api") {
    //   dash_data = this.dashboard_data[this.state.backend];
    // } else if (this.state.frontend_version != "") {
    //   dash_data =
    //     this.dashboard_data[this.state.submodule][this.state.backend + "\n"][
    //       this.state.backend_version
    //     ][this.state.frontend_version];
    // } else {
    //   dash_data =
    //     this.dashboard_data[this.state.submodule][this.state.backend + "\n"][
    //       this.state.backend_version
    //     ];
    // }
    // for (var test in dash_data) {
    //   data.push([test, dash_data[test]]);
    // }
    // console.log(data);
    // this.setState({
    //   dashboard: data,
    // });
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

              {/*<div className="Home-select">
                <select value={this.state.submodule} onChange={this.handleSubmoduleChange}>
                  <option value="Submodule">Submodule</option>
                  {this.state.submodules.map((submodule) => (
                    <option value={submodule}>
                      {submodule.charAt(0).toUpperCase() + submodule.slice(1)}
                    </option>
                  ))}
                </select>
              </div> */}

              <CustomSelect
                value={this.state.submodule}
                handleChange={this.handleSubmoduleChange}
                options={this.state.submodules.map((val) => ({
                  value: val,
                  label: val.charAt(0).toUpperCase() + val.slice(1),
                }))}
                name="Submodule"
              />
              {/* <Select
                isMulti={true}
                value={this.state.submodule}
                onChange={this.handleSubmoduleChange}
                options={this.state.submodules.map((submodule) => ({
                  value: submodule,
                  label: submodule.charAt(0).toUpperCase() + submodule.slice(1),
                }))}
                placeholder="Submodule"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    margin: "10px",
                    borderColor: "#009001",
                  }),
                  indicatorSeparator: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: "#009001",
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#009001",
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#009001",
                  }),
                  multiValue: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: "#009001",
                  }),
                  multiValueLabel: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "white",
                  }),
                  placeholder: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#009001",
                  }),
                }}
              /> */}

              {/* <div className="Home-select">
                <select value={this.state.backend} onChange={this.handleBackendChange}>
                  <option value="Backend">Backend</option>
                  {this.backends.map((backend) => (
                    <option value={backend}>{this.framework_map[backend]}</option>
                  ))}
                </select>
              </div> */}

              <CustomSelect
                value={this.state.backend}
                handleChange={this.handleBackendChange}
                options={this.backend_versions.map((backend) => ({
                  value: backend,
                  label: framework_map(backend),
                }))}
                name="Backend"
              />

              {/* <div className="Home-select">
                <select
                  value={this.state.backend_version}
                  onChange={this.handleBackendVersionChange}
                >
                  <option value="Backend Version">Backend Version</option>
                  {this.state.backend_versions.map((backend_version) => (
                    <option value={backend_version}>{backend_version}</option>
                  ))}
                </select>
              </div> */}

              {/* <div className="Home-select">
                <select value={this.state.frontend} onChange={this.handleFrontendChange}>
                  <option value="Frontend">Frontend:</option>
                  {this.frontends.map((frontend) => (
                    <option value={frontend}>{this.framework_map[frontend]}</option>
                  ))}
                </select>
              </div> */}

              <CustomSelect
                value={this.state.frontend}
                handleChange={this.handleFrontendChange}
                options={this.frontend_versions.map((frontend) => ({
                  value: frontend,
                  label: framework_map(frontend),
                }))}
                name="Frontend"
              />

              {/* <div className="Home-select">
                <select
                  value={this.state.frontend_version}
                  onChange={this.handleFrontendVersionChange}
                >
                  <option value="Frontend Version">Frontend Version:</option>
                  {this.state.frontend_versions.map((frontend_version) => (
                    <option value={frontend_version}>{frontend_version}</option>
                  ))}
                </select>
              </div> */}

              <input type="submit" value="Submit" />
            </form>
          </div>

          <NestedTreeViewTable data={this.state.dashboard} />
          {/* <NestedTable data={this.state.dashboard} /> */}

          {/* <div>
            <table align="center" class="Home-table">
              <tr>
                <th>Test</th>
                <th>Result</th>
              </tr>
              {this.state.dashboard.map((test_result) => (
                <tr>
                  <td>{test_result[0]}</td>
                  <td>
                    <div dangerouslySetInnerHTML={{ __html: test_result[1] }}></div>
                  </td>
                </tr>
              ))}
            </table>
          </div> */}
        </div>
      </>
    );
  }
}

export default Home;
