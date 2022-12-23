// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address payable public manager;
    address payable public currentWinner;
    address payable[] public players;
    uint256 amount;

    constructor() {
        manager = payable(msg.sender);
    }

    modifier justOwner() {
        require(
            msg.sender == manager,
            "Somente o owner do contrato pode fazer isso!"
        );
        _;
    }

    modifier justWinner() {
        require(
            msg.sender == currentWinner,
            "Apenas o Vencedor pode fazer isso!"
        );
        _;
    }

    function enter(uint256 value) public payable {
        require(
            value > .001 ether,
            "O valor precisa ser superior a 0.001 ether"
        );
        //amount += value;
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public justOwner {
        uint256 index = random() % players.length;
        currentWinner = players[index];
        players = new address payable[](0);
    }

    function getPrize() public payable justWinner {
        currentWinner.transfer(address(this).balance);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getCurrentWinner() public view returns (address) {
        return currentWinner;
    }

    function getAmount() public view returns (uint256) {
        return address(this).balance;
    }

    //Делает контракт недействительным и отправляет баланс владельцу контракта
    function kill() public justOwner {
        selfdestruct(manager);
    }
}
