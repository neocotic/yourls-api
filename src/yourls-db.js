/*
 * Copyright (C) 2016 Alasdair Mercer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Requestor } from './request/requestor'

/**
 * Provides the ability to lookup information related to the YOURLS database.
 *
 * @constructor
 * @extends Requestor
 * @protected
 */
export var DB = Requestor.extend({

  /**
   * Retrieves the statistics for this {@link DB}.
   *
   * @param {Function} callback - the callback function to be called with the result
   * @return {DB} A reference to this {@link DB} for chaining purposes.
   * @public
   */
  stats: function(callback) {
    var data = { action: 'db-stats' }

    this.sendRequest(data, 'db-stats', callback)

    return this
  }

})
