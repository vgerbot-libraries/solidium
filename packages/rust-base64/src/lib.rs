use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {}

#[wasm_bindgen]
pub fn encode_base64(buf: &[u8]) -> String {
    return String::from("success!");
}
