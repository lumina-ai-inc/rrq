FROM rust:1.80-slim-bookworm AS chef
RUN apt-get update -y && apt-get -y install pkg-config libssl-dev libpq-dev g++ curl libglib2.0-dev
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY resilient_redis_queue/ .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY resilient_redis_queue/ .
RUN cargo build --release

FROM debian:bookworm-slim as runtime
WORKDIR /app

RUN apt-get update -y; \
    apt-get install -y \
    pkg-config \
    build-essential\
    libssl-dev \
    libpq-dev \
    ca-certificates \
    ; \
    mkdir -p /app/tmp
    
COPY --from=builder /app/target/release/rrq /app/rrq

EXPOSE 8000
ENTRYPOINT ["/app/rrq"]