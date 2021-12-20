/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { TutorialMyAssetContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('TutorialMyAssetContract', () => {

    let contract: TutorialMyAssetContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new TutorialMyAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"tutorial my asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"tutorial my asset 1002 value"}'));
    });

    describe('#tutorialMyAssetExists', () => {

        it('should return true for a tutorial my asset', async () => {
            await contract.tutorialMyAssetExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a tutorial my asset that does not exist', async () => {
            await contract.tutorialMyAssetExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createTutorialMyAsset', () => {

        it('should create a tutorial my asset', async () => {
            await contract.createTutorialMyAsset(ctx, '1003', 'tutorial my asset 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"tutorial my asset 1003 value"}'));
        });

        it('should throw an error for a tutorial my asset that already exists', async () => {
            await contract.createTutorialMyAsset(ctx, '1001', 'myvalue').should.be.rejectedWith(/The tutorial my asset 1001 already exists/);
        });

    });

    describe('#readTutorialMyAsset', () => {

        it('should return a tutorial my asset', async () => {
            await contract.readTutorialMyAsset(ctx, '1001').should.eventually.deep.equal({ value: 'tutorial my asset 1001 value' });
        });

        it('should throw an error for a tutorial my asset that does not exist', async () => {
            await contract.readTutorialMyAsset(ctx, '1003').should.be.rejectedWith(/The tutorial my asset 1003 does not exist/);
        });

    });

    describe('#updateTutorialMyAsset', () => {

        it('should update a tutorial my asset', async () => {
            await contract.updateTutorialMyAsset(ctx, '1001', 'tutorial my asset 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"tutorial my asset 1001 new value"}'));
        });

        it('should throw an error for a tutorial my asset that does not exist', async () => {
            await contract.updateTutorialMyAsset(ctx, '1003', 'tutorial my asset 1003 new value').should.be.rejectedWith(/The tutorial my asset 1003 does not exist/);
        });

    });

    describe('#deleteTutorialMyAsset', () => {

        it('should delete a tutorial my asset', async () => {
            await contract.deleteTutorialMyAsset(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a tutorial my asset that does not exist', async () => {
            await contract.deleteTutorialMyAsset(ctx, '1003').should.be.rejectedWith(/The tutorial my asset 1003 does not exist/);
        });

    });

});
