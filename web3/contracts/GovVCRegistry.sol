// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract GovVCRegistry {
    struct VCRecord {
        string vcHash;
    }

    mapping(string => VCRecord) public vcRecords;

    event VCIssued(string nid, string vcHash);

    function issueVC(string memory nid, string memory vcHash) public {
        require(bytes(vcRecords[nid].vcHash).length == 0, "VC already exists");
        vcRecords[nid] = VCRecord(vcHash);
        emit VCIssued(nid, vcHash);
    }

    function getVC(string memory nid) public view returns (VCRecord memory) {
        return vcRecords[nid];
    }
}

