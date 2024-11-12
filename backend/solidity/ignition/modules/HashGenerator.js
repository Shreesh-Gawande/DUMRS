
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("HashGeneratorModule", (m) => {

  const hashGenerator = m.contract("HashGenerator");

  return { hashGenerator };
});
