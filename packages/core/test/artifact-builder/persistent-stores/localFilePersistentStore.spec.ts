import * as path from 'path';
import { LocalFilePersistentStore } from '../../../src';

it('Should persist data to file', async () => {
  // Arrange
  const ps = new LocalFilePersistentStore({
    filePath: path.resolve(__dirname, 'test.json'),
  });
  const data = Buffer.from('Hello World');
  // Act, Assert
  await expect(ps.save(data)).resolves.not.toThrow();
});

it('Should load persisted data from file with correct data', async () => {
  // Arrange
  const ps = new LocalFilePersistentStore({
    filePath: path.resolve(__dirname, 'test.json'),
  });
  const data = Buffer.from('Hello World');
  await ps.save(data);
  // Act
  const loadedData = await ps.load();
  // Assert
  expect(loadedData.toString()).toEqual('Hello World');
});
