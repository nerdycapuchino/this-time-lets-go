"use client";

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
    fontSize: 10,
  },
});

type InvoiceProps = {
    invoice: {
        id: number;
        amount: number;
        due_date: string;
        currency: string;
    };
    project: {
        name: string;
    };
    client: {
        first_name: string;
        last_name: string;
    };
};

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    INR: '₹',
};

export default function InvoiceDocument({ invoice, project, client }: InvoiceProps) {
  const currencySymbol = currencySymbols[invoice.currency] || '$';
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>StudioBMS Invoice</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Invoice #{invoice.id}</Text>
          <Text style={styles.text}>Project: {project.name}</Text>
          <Text style={styles.text}>Client: {client.first_name} {client.last_name}</Text>
          <Text style={styles.text}>Date: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.text}>Due Date: {new Date(invoice.due_date).toLocaleDateString()}</Text>
          <Text style={styles.text}>Currency: {invoice.currency}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.title}>Amount Due</Text>
            <Text style={styles.text}>{currencySymbol}{invoice.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
}
