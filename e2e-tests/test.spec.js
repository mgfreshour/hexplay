/* global browser */
'use strict';

describe('page title', () => {
    it('has the correct page title', function* () {
        yield browser.url('/');
        const title = yield browser.getTitle();
        expect(title).toEqual('Test Me');
    });
});
