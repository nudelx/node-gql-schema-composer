const express = require('express')
const fs = require('fs')
const glob = require("glob")

const readFolder = function (path) {
  return new Promise((yes, no) => {
    glob(`${path}/**/*.{gql,graphql}`, function (err, res) {
      err && no(err)
      if (Array.isArray(res) && !res.length) { throw new Error(`The path ${path} is empty `, { cause: res }) }
      yes(res)
    })
  })
}
const composeSchema = async function (path) {
  const allFiles = await readFolder(path)
  return allFiles.reduce(function (all, value) {
    all += `${'\n'} ${fs.readFileSync(value, { encoding: 'utf8', flag: 'r' })} ${'\n'}`
    return all
  }, '')
}

const dumpToFile = function (path, name = 'schema') {
  const currentPath = __dirname.split('node_modules')[0] || __dirname
  console.log(`${currentPath}/${name}.gql`)
  composeSchema(path).then(data => {
    fs.writeFile(`${__dirname}/${name}.gql`, data, function (err) {
      if (err) { return console.log(err) }
      console.log(`your schema ${name}.gql saved`);
    });
  })
}

module.exports = {
  dumpToFile,
  composeSchema,
  readFolder
}