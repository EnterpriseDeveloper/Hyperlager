/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { TutorialMyAsset } from './tutorial-my-asset';

@Info({title: 'TutorialMyAssetContract', description: 'My Smart Contract' })
export class TutorialMyAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async tutorialMyAssetExists(ctx: Context, tutorialMyAssetId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(tutorialMyAssetId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createTutorialMyAsset(ctx: Context, tutorialMyAssetId: string, value: string): Promise<void> {
        const exists = await this.tutorialMyAssetExists(ctx, tutorialMyAssetId);
        if (exists) {
            throw new Error(`The tutorial my asset ${tutorialMyAssetId} already exists`);
        }
        const tutorialMyAsset = new TutorialMyAsset();
        tutorialMyAsset.value = value;
        const buffer = Buffer.from(JSON.stringify(tutorialMyAsset));
        await ctx.stub.putState(tutorialMyAssetId, buffer);
    }

    @Transaction(false)
    @Returns('TutorialMyAsset')
    public async readTutorialMyAsset(ctx: Context, tutorialMyAssetId: string): Promise<TutorialMyAsset> {
        const exists = await this.tutorialMyAssetExists(ctx, tutorialMyAssetId);
        if (!exists) {
            throw new Error(`The tutorial my asset ${tutorialMyAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(tutorialMyAssetId);
        const tutorialMyAsset = JSON.parse(buffer.toString()) as TutorialMyAsset;
        return tutorialMyAsset;
    }

    @Transaction()
    public async updateTutorialMyAsset(ctx: Context, tutorialMyAssetId: string, newValue: string): Promise<void> {
        const exists = await this.tutorialMyAssetExists(ctx, tutorialMyAssetId);
        if (!exists) {
            throw new Error(`The tutorial my asset ${tutorialMyAssetId} does not exist`);
        }
        const tutorialMyAsset = new TutorialMyAsset();
        tutorialMyAsset.value = newValue;
        const buffer = Buffer.from(JSON.stringify(tutorialMyAsset));
        await ctx.stub.putState(tutorialMyAssetId, buffer);
    }

    @Transaction()
    public async deleteTutorialMyAsset(ctx: Context, tutorialMyAssetId: string): Promise<void> {
        const exists = await this.tutorialMyAssetExists(ctx, tutorialMyAssetId);
        if (!exists) {
            throw new Error(`The tutorial my asset ${tutorialMyAssetId} does not exist`);
        }
        await ctx.stub.deleteState(tutorialMyAssetId);
    }

}
