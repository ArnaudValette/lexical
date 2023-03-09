/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  moveDown,
  moveLeft,
  moveRight,
  moveToEditorBeginning,
  pressBackspace,
  selectAll,
} from '../keyboardShortcuts/index.mjs';
import {
  assertHTML,
  click,
  clickSelectors,
  copyToClipboard,
  focusEditor,
  html,
  initialize,
  insertHorizontalRule,
  insertSampleImage,
  insertTable,
  insertTableColumnBefore,
  insertTableRowBelow,
  IS_COLLAB,
  mergeTableCells,
  pasteFromClipboard,
  SAMPLE_IMAGE_URL,
  selectCellsFromTableCords,
  selectFromAdditionalStylesDropdown,
  test,
} from '../utils/index.mjs';

async function fillTablePartiallyWithText(page) {
  await page.keyboard.type('a');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('b');
  await page.keyboard.press('Tab');
  await page.keyboard.press('c');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  await page.keyboard.press('b');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('d');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('e');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('f');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('c');
}

test.describe('Tables', () => {
  test.beforeEach(({isCollab, page}) => initialize({isCollab, page}));
  test(`Can a table be inserted from the toolbar`, async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);
    await focusEditor(page);

    await insertTable(page, 2, 2);

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Can type inside of table cell`, async ({page, isPlainText}) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 2);

    await page.keyboard.type('abc');

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">abc</span></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Can navigate table with keyboard`, async ({page, isPlainText}) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 3);

    await fillTablePartiallyWithText(page);

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Can select cells using Table selection`, async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 3);

    await fillTablePartiallyWithText(page);
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 1},
      true,
      false,
    );

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(`Can select cells using Table selection via keyboard`, async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 3, 3);

    await fillTablePartiallyWithText(page);

    let p = page;

    if (IS_COLLAB) {
      await focusEditor(page);
      p = await page.frame('left');
    }

    const firstRowFirstColumnCellBoundingBox = await p.locator(
      'table:first-of-type > tr:nth-child(1) > th:nth-child(1)',
    );

    // Focus on inside the iFrame or the boundingBox() below returns null.
    await firstRowFirstColumnCellBoundingBox.click();

    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(`Can style text using Table selection`, async ({page, isPlainText}) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 3);

    await fillTablePartiallyWithText(page);
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 1},
      true,
      false,
    );

    await clickSelectors(page, ['.bold', '.italic', '.underline']);

    await selectFromAdditionalStylesDropdown(page, '.strikethrough');

    // Check that the character styles are applied.
    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><strong data-lexical-text="true">a</strong></p>
            </th>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><strong data-lexical-text="true">bb</strong></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><strong data-lexical-text="true">d</strong></p>
            </th>
            <td
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p dir="ltr"><strong data-lexical-text="true">e</strong></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">a</strong></p>
            </th>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">bb</strong></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">d</strong></p>
            </th>
            <td>
              <p dir="ltr"><strong data-lexical-text="true">e</strong></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(`Can copy + paste (internal) using Table selection`, async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 3);

    await fillTablePartiallyWithText(page);
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 1},
      true,
      false,
    );

    const clipboard = await copyToClipboard(page);

    // For some reason you need to click the paragraph twice for this to pass
    // on Collab Firefox.
    await click(page, 'div.ContentEditable__root > p:first-of-type');
    await click(page, 'div.ContentEditable__root > p:first-of-type');

    await pasteFromClipboard(page, clipboard);

    // Check that the character styles are applied.
    await assertHTML(
      page,
      html`
        <table>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
          </tr>
        </table>
        <table>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Can clear text using Table selection`, async ({page, isPlainText}) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 3);

    await fillTablePartiallyWithText(page);
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 1},
      true,
      false,
    );

    await page.keyboard.press('Backspace');

    // Check that the text was cleared.
    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Range Selection is corrected when it contains a partial Table.`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 1, 2);
    await moveToEditorBeginning(page);

    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.up('Shift');

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </th>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </th>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(`Select All when document contains tables adds custom table styles.`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);
    await page.keyboard.type('Hello World');

    await insertTable(page, 2, 3);

    await selectAll(page);

    await assertHTML(
      page,
      html`
        <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
        <table>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </th>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </th>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </th>
            <td
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </td>
            <td
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
        <table>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(`Horizontal rule inside cell`, async ({page, isPlainText}) => {
    test.skip(isPlainText);
    await focusEditor(page);

    await insertTable(page, 1, 2);
    await page.keyboard.type('123');
    await insertHorizontalRule(page);

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <tr>
            <th>
              <p><span data-lexical-text="true">123</span></p>
              <hr contenteditable="false" data-lexical-decorator="true" />
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test('Grid selection: can select multiple cells and insert an image', async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);

    await insertTable(page, 2, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await page.keyboard.type('Hello');

    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');

    await insertSampleImage(page);
    await page.keyboard.type(' <- it works!');

    // Wait for Decorator to mount.
    await page.waitForTimeout(3000);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">Hello</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span
                  class="editor-image"
                  contenteditable="false"
                  data-lexical-decorator="true">
                  <div draggable="false">
                    <img
                      alt="Yellow flower in tilt shift lens"
                      draggable="false"
                      src="${SAMPLE_IMAGE_URL}"
                      style="height: inherit; max-width: 500px; width: inherit" />
                  </div>
                </span>
                <span data-lexical-text="true">&lt;- it works!</span>
              </p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Grid selection: can backspace lines, backspacing empty cell does not destroy it #3278', async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);

    await insertTable(page, 1, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await page.keyboard.type('cell one');
    await moveRight(page, 1);
    await page.keyboard.type('first line');
    await page.keyboard.press('Enter');
    await page.keyboard.type('second line');

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">cell one</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first line</span>
              </p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">second line</span>
              </p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );

    await pressBackspace(page, 50);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">cell one</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Merge cells', async ({page, isPlainText}) => {
    test.skip(isPlainText);

    await focusEditor(page);

    await insertTable(page, 1, 3);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await moveRight(page, 1);
    await page.keyboard.type('first');
    await page.keyboard.press('Tab');
    await page.keyboard.type('second');
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 0},
      {x: 2, y: 0},
      true,
      true,
    );
    await mergeTableCells(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first</span>
              </p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first</span>
              </p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Select multiple merged cells (selection expands to a rectangle)', async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);

    await insertTable(page, 3, 3);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await moveDown(page, 1);
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 0, y: 1},
      true,
      true,
    );
    await mergeTableCells(page);
    await page.pause();

    await moveRight(page, 1);
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 0},
      {x: 2, y: 0},
      true,
      true,
    );
    await mergeTableCells(page);
    await page.pause();

    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 0},
      true,
      true,
    );
    await page.pause();

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table disable-selection">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="2"
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2"
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <td
              class="PlaygroundEditorTheme__tableCell"
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td
              class="PlaygroundEditorTheme__tableCell"
              style="background-color: rgb(172, 206, 247); caret-color: transparent">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Insert row above (with conflicting merged cell)', async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);

    await insertTable(page, 2, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await moveDown(page, 1);
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 0},
      {x: 1, y: 1},
      true,
      false,
    );
    await mergeTableCells(page);

    await moveLeft(page, 1);
    await page.pause();
    await insertTableRowBelow(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="3">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell"><br /></td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Insert column before (with conflicting merged cell)', async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);

    await focusEditor(page);

    await insertTable(page, 2, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await moveDown(page, 1);
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 0},
      true,
      true,
    );
    await mergeTableCells(page);

    await moveDown(page, 1);
    await moveRight(page, 1);
    await insertTableColumnBefore(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="3">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell"><br /></td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });
});
