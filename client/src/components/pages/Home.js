import React, { Component } from "react";

import "./Home.css";
import { get } from "jquery";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submodules: ["activations", "losses", "layers", "norms"],
      submodule: "",
      backend: "",
      backend_version: "",
      frontend: "",
      frontend_version: "",
      dashboard: [],
    };
    this.dashboard_data = {};
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
      numpy: "NumPy",
      exp_core: "Experimental Core",
      exp_nn: "Experimental NN",
      misc: "Miscellaneous",
    };
    this.framework_map = {
      numpy: "NumPy",
      torch: "PyTorch",
      jax: "JAX",
      tensorflow: "TensorFlow",
    };
    this.backends = ["numpy", "torch", "jax", "tensorflow"];
    this.backend_versions = ["1.10", "1.11", "1.12", "1.13"];
    this.frontends = ["numpy", "torch", "jax", "tensorflow"];
    this.frontend_versions = ["1.10", "1.11", "1.12", "1.13"];
    this.handleSubmoduleChange = this.handleSubmoduleChange.bind(this);
    this.handleModuleChange = this.handleModuleChange.bind(this);
    this.handleBackendChange = this.handleBackendChange.bind(this);
    this.handleBackendVersionChange = this.handleBackendVersionChange.bind(this);
    this.handleFrontendChange = this.handleFrontendChange.bind(this);
    this.handleFrontendVersionChange = this.handleFrontendVersionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleModuleChange(event) {
    this.setState({ module: event.target.value });
    get("/api/submodules", { module: event.target.value }).then((submodules) => {
      let mod_submods = [];
      var submodule;
      for (submodule in submodules) {
        if (
          submodule != "_id" &&
          submodule != "numpy" &&
          submodule != "jax" &&
          submodule != "torch" &&
          submodule != "tensorflow"
        ) {
          mod_submods.push(submodule);
        }
      }
      this.setState({ submodules: mod_submods });
      this.dashboard_data = submodules;
    });
  }

  handleSubmoduleChange(event) {
    this.setState({ submodule: event.target.value });
  }

  handleBackendChange(event) {
    this.setState({ backend: event.target.value });
  }

  handleBackendVersionChange(event) {
    this.setState({ backend_version: event.target.value });
  }

  handleFrontendChange(event) {
    this.setState({ frontend: event.target.value });
  }

  handleFrontendVersionChange(event) {
    this.setState({ frontend_version: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    var data = [];
    var dash_data = this.dashboard_data[this.state.submodule][this.state.backend + "\n"];
    for (var test in dash_data) {
      data.push([test, dash_data[test]]);
    }
    console.log(data);
    this.setState({
      dashboard: data,
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

              <div className="Home-select">
                <select value={this.state.submodule} onChange={this.handleSubmoduleChange}>
                  <option value="Submodule">Submodule</option>
                  {this.state.submodules.map((submodule) => (
                    <option value={submodule}>{submodule}</option>
                  ))}
                </select>
              </div>

              <div className="Home-select">
                <select value={this.state.backend} onChange={this.handleBackendChange}>
                  <option value="Backend">Backend</option>
                  {this.backends.map((backend) => (
                    <option value={backend}>{this.framework_map[backend]}</option>
                  ))}
                </select>
              </div>

              <div className="Home-select">
                <select
                  value={this.state.backend_version}
                  onChange={this.handleBackendVersionChange}
                >
                  <option value="Backend Version">Backend Version:</option>
                  {this.backend_versions.map((backend_version) => (
                    <option value={backend_version}>{backend_version}</option>
                  ))}
                </select>
              </div>

              <div className="Home-select">
                <select value={this.state.frontend} onChange={this.handleFrontendChange}>
                  <option value="Frontend">Frontend:</option>
                  {this.frontends.map((frontend) => (
                    <option value={frontend}>{this.framework_map[frontend]}</option>
                  ))}
                </select>
              </div>

              <div className="Home-select">
                <select
                  value={this.state.frontend_version}
                  onChange={this.handleFrontendVersionChange}
                >
                  <option value="Frontend Version">Frontend Version:</option>
                  {this.frontend_versions.map((frontend_version) => (
                    <option value={frontend_version}>{frontend_version}</option>
                  ))}
                </select>
              </div>

              <input type="submit" value="Submit" />
            </form>
          </div>
          <div>
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
          </div>
        </div>
      </>
    );
  }
}

export default Home;
