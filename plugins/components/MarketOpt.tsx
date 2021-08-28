import { Btn } from "./Btn";
import { ButtonGroup } from "./CoreUI";
import React, { useState } from "react";
import { callAction, getRandomActionId } from "../helpers/helpers";
import { BigNumber, utils } from "ethers";
import { notifyManager, own } from "../contants";
import { useContract } from "../helpers/AppHooks";
import styled from "styled-components";

const Price  = styled.div`
  font-size: 2em;
  font-weight: bold;
  text-align: center;
`;

export function MarketOpt({ artifact, onCancel }) {
    const { market } = useContract();
    const [processing, setProcessing] = useState(false);
    const [show, setShow] = useState(true);

    function buy() {
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'buy',
            };
            const overrids = {
                value: BigNumber.from(artifact.price).toString(),
                gasLimit: 5000000,
                gasPrice: undefined,
            };
            callAction(market, action, [BigNumber.from(artifact.listId)], overrids).then(()=>{
                setShow(false);
            }).catch((err) => {
                console.error(err);
                notifyManager.unsubmittedTxFail(action, err);
            }).finally(() => {
                setProcessing(false);
            });
        }
    }

    function unlist() {
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'unlist',
            };
            callAction(market, action, [BigNumber.from(artifact.listId)]).then(()=>{
                setShow(false);
            }).catch((err) => {
                console.error(err);
                notifyManager.unsubmittedTxFail(action, err);
            }).finally(() => {
                setProcessing(false);
            });
        }
    }

    
    return [
        <Price key="p">{`${utils.formatEther(artifact.price)}xDai`}</Price>,
        <div key="b">
            <ButtonGroup>
                {artifact.owner === own ? 
                <Btn className="btn" disabled={processing || !show} onClick={unlist}>{processing ? 'Waiting': 'Unlist'}</Btn> : 
                <Btn className="btn" disabled={processing || !show} onClick={buy}>{processing ? 'Waiting': 'Buy'}</Btn>}
                <Btn onClick={onCancel} className="btn">Cancel</Btn>
            </ButtonGroup>
        </div>
    ]
}