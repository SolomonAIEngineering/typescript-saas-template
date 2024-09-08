import { Job, invokeTrigger } from "@trigger.dev/sdk";

export const exampleJob = new Job({
  id: "example-job",
  name: "Example Job",
  version: "0.0.1",
  trigger: invokeTrigger(),
  run: async (payload, io, ctx) => {
    await io.logger.info("Hello world!", { payload });

    return {
      message: "Hello world!",
    };
  },
});
