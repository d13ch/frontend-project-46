import _ from 'lodash';

const getKeys = (file1, file2) => {
  const keys1 = Object.keys(file1);
  const keys2 = Object.keys(file2);
  const keys = _.union(keys1, keys2);
  return _.sortBy(keys);
};

const isObject = (data) => typeof data === 'object' && data !== null;

const generateDiffTree = (fileData1, fileData2) => {
  const keys = getKeys(fileData1, fileData2);
  const diff = keys.map((key) => {
    if (!_.has(fileData2, key)) {
      return { key: `${key}`, value: fileData1[key], tag: 'deleted' };
    }
    if (!_.has(fileData1, key)) {
      return { key: `${key}`, value: fileData2[key], tag: 'added' };
    }
    if (isObject(fileData1[key]) && isObject(fileData2[key])) {
      return { key: `${key}`, value: generateDiffTree(fileData1[key], fileData2[key]), tag: 'nested' };
    }
    return fileData1[key] === fileData2[key]
      ? { key: `${key}`, value: fileData1[key], tag: 'unchanged' }
      : { key: `${key}`, value: { oldValue: fileData1[key], newValue: fileData2[key] }, tag: 'changed' };
  });
  return diff;
};
export default generateDiffTree;
export { getKeys };
