/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class TutorialMyAsset {

    @Property()
    public value: string;

}
