use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Thư mục dữ liệu RIÊNG của launcher (không đụng ~/.minecraft)
pub fn data_dir(app: &AppHandle) -> PathBuf {
    let dir = app
        .path()
        .app_data_dir()
        .expect("không xác định được app_data_dir")
        .join("CosmicLauncher");
    std::fs::create_dir_all(&dir).ok();
    dir
}
