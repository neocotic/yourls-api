/*
 * Copyright (C) 2017 Alasdair Mercer
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

/**
 * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
 *
 * Any of the <code>sources</code> that are <code>null</code> will simply be ignored.
 *
 * @param {Object} target - the target object which should be extended
 * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
 * @return {Object} A reference to <code>target</code>.
 * @protected
 */
export function extend(target, sources) {
  sources = Array.prototype.slice.call(arguments, 1)

  for (var i = 0, length = sources.length, property, source; i < length; i++) {
    source = sources[i]

    if (source) {
      for (property in source) {
        if (Object.prototype.hasOwnProperty.call(source, property)) {
          target[property] = source[property]
        }
      }
    }
  }

  return target
}
