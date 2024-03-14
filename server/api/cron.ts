export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain');
  setResponseHeader(event, 'Cache-Control', 'no-cache');
  setResponseHeader(event, 'Charset', 'utf-8');
  setResponseHeader(event, 'Transfer-Encoding', 'chunked');

  const logStream = new ReadableStream({
    async start(controller) {
      const log = (...text: unknown[]) => {
        controller.enqueue(`${text.join(' ')}\n`);
        console.log(...text);
      };

      log('> Starting task ...');

      try {
        // await importCatalogTask(log);
        await runTask('import:feed', { log });
      } catch (error) {
        console.error(error);
        controller.enqueue('Error: ' + (error as Error).message + '\n');
      }

      log('> Task finished');

      controller.close();
    },
  });

  return sendStream(event, logStream);
});
