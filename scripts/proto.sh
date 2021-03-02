
# Path to this plugin
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
#PROTOC_GEN_GRPC_PATH="./node_modules/.bin/grpc_tools_node_protoc_plugin"

# Directory (relative path from the proto file?) to write generated code to (.js and .d.ts files)
OUT_DIR="./"

# Download the protobuf file from the marketstore repository
PROTO_FILENAME="marketstore.proto"
wget https://raw.githubusercontent.com/alpacahq/marketstore/master/proto/marketstore.proto -O ./src/proto/${PROTO_FILENAME}

# then,
protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-web:${OUT_DIR}" \
    ./src/proto/${PROTO_FILENAME}

#protoc \
#    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#    --plugin=protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH} \
#    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
#    --ts_out="service=grpc-node:${OUT_DIR}" \
#    --grpc_out="${OUT_DIR}"
#    ./src/proto/${PROTO_FILENAME}