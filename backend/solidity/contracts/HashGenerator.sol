// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HashGenerator {
    // Mapping from patient ID (as a string) to hash of medical record data
    mapping(string => string) private recordHashes;

    // Event to notify when a hash is generated and stored
    event RecordHashStored(string indexed patientId, string hash);

    // Function to generate and store hash of medical data associated with a patient ID
    function storeRecordHash(string memory patientId, string memory hash) public {
        // Store the hash in the mapping
        recordHashes[patientId] = hash;

        // Emit event to notify of stored hash
        emit RecordHashStored(patientId, hash);
    }

    // Function to retrieve the hash of medical record data by patient ID
    function getRecordHash(string memory patientId) public view returns (string memory) {
        return recordHashes[patientId];
    }
}
