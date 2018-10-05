### Translations

Wanna contribute? It's easy!

1. You go find the component or page you wanna translate
2. Create an object in the language you choose in our translations folder
3. Copy the property used in the english translation
4. And go translate!
5. After all that, you make a PR and then you're done!

### Formatting

Formatting is pretty standard:

    <page name>: {
        <page content>: <translation>
    }

### Folder structure

      translations
      |
      | cn.js # these are the translations
      | de.js # these are the translations
      | gb.js # these are the translations
      | jp.js # these are the translations
      | kr.js # these are the translations
      | rs.js # these are the translations
      | index.js # This imports all of them

Note: Best and easiest way would be to use `gb.js (English Translations)` as reference.
