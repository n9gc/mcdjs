use dashmap::{DashMap, DashSet};
use gix::features::hash::hasher;
use gix::objs::encode::loose_header;
use rayon::prelude::*;

use std::fs;
use std::path::{Path, PathBuf};
use std::{collections::HashMap, sync::Arc};
use xxhash_rust::xxh3;

pub fn xxhash(
  file_set: DashSet<PathBuf>,
  cwd: &str,
) -> Option<HashMap<String, u64>> {
  let cwd: String = cwd.into();
  let hashes = Arc::new(DashMap::<String, u64>::new());

  file_set.into_par_iter().for_each(|file_path| {
    let map = hashes.clone();
    let base_cwd = cwd.clone();
    let bytes = read_file(file_path.as_path()).expect("Failed to read file");
    map.insert(
      file_path
        .strip_prefix(&base_cwd)
        .unwrap()
        .to_string_lossy()
        .to_string()
        .replace("\\", "/"),
      xxh3::xxh3_64(&bytes),
    );
  });

  if let Ok(map) = Arc::try_unwrap(hashes) {
    return Some(map.into_iter().collect::<HashMap<String, u64>>());
  }

  return None;
}

pub fn git_hash(
  file_set: DashSet<PathBuf>,
  cwd: &str,
) -> Option<HashMap<String, String>> {
  let cwd: String = cwd.into();
  let hashes = Arc::new(DashMap::<String, String>::new());

  file_set.into_par_iter().for_each(|file_path| {
    let map = hashes.clone();
    let base_cwd = cwd.clone();

    let bytes = read_file(file_path.as_path()).expect("Failed to read file");
    let mut hasher = hasher(gix::hash::Kind::Sha1);
    hasher.update(&loose_header(gix::objs::Kind::Blob, bytes.len()));
    hasher.update(&bytes);

    map.insert(
      file_path
        .strip_prefix(&base_cwd)
        .unwrap()
        .to_string_lossy()
        .to_string()
        .replace("\\", "/"),
      hex::encode(hasher.digest()),
    );
  });

  if let Ok(map) = Arc::try_unwrap(hashes) {
    return Some(map.into_iter().collect::<HashMap<String, String>>());
  }

  return None;
}



pub fn git_hash_vec(
  files: Vec<PathBuf>,
  cwd: &str,
) -> Option<HashMap<String, String>> {
  let cwd: String = cwd.into();
  let hashes = Arc::new(DashMap::<String, String>::new());

  files.into_par_iter().for_each(|file_path| {
    let map = hashes.clone();
    let base_cwd = cwd.clone();

    let bytes = read_file(file_path.as_path()).expect("Failed to read file");
    let mut hasher = hasher(gix::hash::Kind::Sha1);
    hasher.update(&loose_header(gix::objs::Kind::Blob, bytes.len()));
    hasher.update(&bytes);

    map.insert(
      file_path
        .strip_prefix(&base_cwd)
        .unwrap()
        .to_string_lossy()
        .to_string()
        .replace("\\", "/"),
      hex::encode(hasher.digest()),
    );
  });

  if let Ok(map) = Arc::try_unwrap(hashes) {
    return Some(map.into_iter().collect::<HashMap<String, String>>());
  }

  return None;
}

fn read_file(path: &Path) -> Result<Vec<u8>, anyhow::Error> {
  let read_bytes = fs::read(path);

  let mut result = Vec::new();
  let mut prev_byte: Option<u8> = None;

  if let Ok(ref bytes) = read_bytes {
    if is_binary(bytes) {
      return Ok(bytes.clone());
    }
  }

  if let Ok(ref bytes) = read_bytes {
    for byte in bytes.clone() {
      match (prev_byte, byte) {
        (Some(b'\r'), b'\n') => {}
        (None, _) => {}
        (Some(ref b), _) => {
          // println!("normal byte: {:?}", b as char);
          // Not a CRLF, add previous byte to output vector
          result.push(b.clone());
        }
      }

      prev_byte = Some(byte);
    }

    // Add last byte to output vector if it was not a CR
    if let Some(byte) = prev_byte {
      if byte != b'\r' {
        result.push(byte);
      }
    }
  } else {
    return Err(anyhow::anyhow!("Failed to read file"));
  }

  Ok(result)
}

// Same rule as git in detecting whether or not the file is binary
fn is_binary(bytes: &Vec<u8>) -> bool {
  let first_few_bytes = bytes.iter().take(8000);
  for byte in first_few_bytes {
    if byte == &b'\0' {
      return true;
    }
  }

  false
}
