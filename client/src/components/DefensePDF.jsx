import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import parse, { domToReact } from 'html-react-parser';

// Register a standard font (Times New Roman is standard for legal docs, 
// but we'll use a standard serif substitute or register one if needed. 
// For now, Helvetica/Times are built-in).
// Note: @react-pdf supports standard fonts: 'Courier', 'Helvetica', 'Times-Roman'

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,      // ~2cm
    paddingBottom: 60,   // ~2cm
    paddingLeft: 60,     // ~2cm
    paddingRight: 60,    // ~2cm
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  // Text Styles
  p: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  h1: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  h2: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    marginBottom: 10,
    marginTop: 10,
  },
  h3: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  strong: {
    fontFamily: 'Times-Bold',
  },
  em: {
    fontFamily: 'Times-Italic',
  },
  ul: {
    marginLeft: 15,
    marginBottom: 10,
  },
  li: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    width: 15,
    fontSize: 12,
  },
  liContent: {
    flex: 1
  }
});

// Utility to parse inline CSS styles into React-PDF compatible object
const parseInlineStyle = (styleString) => {
  if (!styleString) return {};
  const styles = {};
  const pairs = styleString.split(';');
  pairs.forEach(pair => {
    const [key, value] = pair.split(':').map(s => s.trim());
    if (key && value) {
      // Map CSS properties to React-PDF properties
      if (key === 'text-align') styles.textAlign = value;
      if (key === 'text-indent') styles.textIndent = parseInt(value, 10);
      if (key === 'font-size') styles.fontSize = parseInt(value, 10);
      if (key === 'font-weight') {
        if (value === 'bold') styles.fontFamily = 'Times-Bold';
      }
      if (key === 'margin-bottom') styles.marginBottom = parseInt(value, 10);
      if (key === 'margin-top') styles.marginTop = parseInt(value, 10);
      if (key === 'text-transform') {
        if (value === 'uppercase') styles.textTransform = 'uppercase';
      }
    }
  });
  return styles;
};

// Utility to recursively map HTML DOM nodes to React-PDF primitives
const HtmlToPdf = ({ html }) => {
  if (!html) return null;

  const options = {
    replace: (domNode) => {
      // Handle Text Nodes
      if (domNode.type === 'text') {
        return domNode.data;
      }

      // Handle Paragraphs
      if (domNode.name === 'p') {
        const inlineStyle = parseInlineStyle(domNode.attribs?.style);
        
        // Merge base p styles with inline styles
        // Properties that must be on Text component: textIndent, textAlign, textTransform, fontSize, fontFamily
        const { textIndent, textAlign, textTransform, fontSize, fontFamily, ...viewStyle } = inlineStyle;
        
        const textStyle = {
          textIndent: textIndent || 0,
          textAlign: textAlign || styles.p.textAlign,
        };
        if (textTransform) textStyle.textTransform = textTransform;
        if (fontSize) textStyle.fontSize = fontSize;
        if (fontFamily) textStyle.fontFamily = fontFamily;
        
        return (
          <View style={[styles.p, viewStyle]}>
            <Text style={textStyle}>
              {domToReact(domNode.children, options)}
            </Text>
          </View>
        );
      }

      // Handle Headings
      if (domNode.name === 'h1') {
        const inlineStyle = parseInlineStyle(domNode.attribs?.style);
        return (
          <View style={{ marginBottom: inlineStyle.marginBottom || 10, marginTop: inlineStyle.marginTop || 10 }}>
            <Text style={[styles.h1, inlineStyle]}>{domToReact(domNode.children, options)}</Text>
          </View>
        );
      }
      if (domNode.name === 'h2') {
        const inlineStyle = parseInlineStyle(domNode.attribs?.style);
        return (
          <View style={{ marginBottom: inlineStyle.marginBottom || 10, marginTop: inlineStyle.marginTop || 10 }}>
            <Text style={[styles.h2, inlineStyle]}>{domToReact(domNode.children, options)}</Text>
          </View>
        );
      }
      if (domNode.name === 'h3') {
        const inlineStyle = parseInlineStyle(domNode.attribs?.style);
        return (
          <View style={{ marginBottom: inlineStyle.marginBottom || 8, marginTop: inlineStyle.marginTop || 8 }}>
            <Text style={[styles.h3, inlineStyle]}>{domToReact(domNode.children, options)}</Text>
          </View>
        );
      }

      // Handle Lists
      if (domNode.name === 'ul' || domNode.name === 'ol') {
        return <View style={styles.ul}>{domToReact(domNode.children, options)}</View>;
      }
      if (domNode.name === 'li') {
        return (
          <View style={styles.li}>
            <Text style={styles.bullet}>•</Text>
            <View style={styles.liContent}>
               <Text>{domToReact(domNode.children, options)}</Text>
            </View>
          </View>
        );
      }

      // Handle Formatting (Bold, Italic) - Nested in Text
      // Note: React-PDF handles nested <Text> for inline styling
      if (domNode.name === 'strong' || domNode.name === 'b') {
        return <Text style={styles.strong}>{domToReact(domNode.children, options)}</Text>;
      }
      if (domNode.name === 'em' || domNode.name === 'i') {
        return <Text style={styles.em}>{domToReact(domNode.children, options)}</Text>;
      }
      
      // Line Breaks
      if (domNode.name === 'br') {
        return <Text>{'\n'}</Text>;
      }
    }
  };

  return parse(html, options);
};

export const DefenseDocument = ({ content }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* We wrap content in a generic View, but HtmlToPdf returns Views/Texts */}
      <View>
        <HtmlToPdf html={content} />
      </View>
      
      {/* Footer / Page Numbers could go here */}
      <Text style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: 'grey' }} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default DefenseDocument;
