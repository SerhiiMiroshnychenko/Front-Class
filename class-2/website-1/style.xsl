<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/page">
    <html>
      <head>
        <title><xsl:value-of select="title"/></title>
        <style>
          body {
            font-family: sans-serif;
            background: #eef2f5;
            padding: 40px;
          }
          h1 {
            color: #2a2a2a;
          }
          p {
            margin-top: 10px;
            font-size: 18px;
          }
          .note {
            margin-top: 20px;
            font-style: italic;
            color: #555;
          }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="content/header"/></h1>
        <p><xsl:value-of select="content/paragraph"/></p>
        <div class="note">
          <xsl:value-of select="content/note"/>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
