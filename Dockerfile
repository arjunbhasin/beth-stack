# Use the offical Bun image
FROM jarredsumner/bun:edge

# Set the Docker working directory as /usr/src/
# Copy everything from here into Docker's /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

# Install the dependencies (Bao.js)
RUN bun install

# The port that Elysia will listen on
EXPOSE 3000

# Run the Bao.js webserver
CMD bun run app/index.tsx