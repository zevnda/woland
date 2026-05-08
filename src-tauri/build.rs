fn main() {
    tauri_build::build();

    // Try to load from .env file first, then fall back to environment variables
    dotenv::dotenv().ok();

    let device_mac =
        std::env::var("DEVICE_MAC").unwrap_or_else(|_| "AA:BB:CC:DD:EE:FF".to_string());
    let broadcast_addr =
        std::env::var("BROADCAST_ADDR").unwrap_or_else(|_| "255.255.255.255:9".to_string());

    // Write constants to be included in the binary
    println!("cargo:rustc-env=WOL_DEVICE_MAC={}", device_mac);
    println!("cargo:rustc-env=WOL_BROADCAST_ADDR={}", broadcast_addr);

    println!(
        "[BUILD] WOL config hardcoded - MAC: {}, Broadcast: {}",
        device_mac, broadcast_addr
    );
}
