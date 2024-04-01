function loader2(sourceCode) {
  console.log('join loader2');
  return sourceCode + `\n const loader2 = 'loader2 has been processed '`;
}

module.exports = loader2;
