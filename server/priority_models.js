const mongoose = require("mongoose")

let conn = mongoose.createConnection(process.env.ATLAS_SRV,
{
    dbName: "ci_dashboard"
})

const demosSchema = new mongoose.Schema({
    _id: String,
    label: String,
    company: String,
    ivy_functions: {type: [String], ref: "ivy_tests"},
    frontend_functions: {type: [String], ref: "frontend_tests"}
}, { versionKey: false })

const frontendFunctionTestSchema = new mongoose.Schema({
    _id: String,
    demos: [String]

})


frontendFunctionTestModel = conn.model("frontend_tests", frontendFunctionTestSchema)


demosModel = conn.model("demos", demosSchema)



backendFunctionTestSchema = new mongoose.Schema({
    _id: String,
    demos: [String]
})


backendFunctionTestModel = conn.model("ivy_tests", backendFunctionTestSchema)


module.exports = {
    frontendFunctionTestModel,
    backendFunctionTestModel,
    demosModel,
    conn
    // demosModel
}