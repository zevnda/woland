use socket2::{Domain, Protocol, Socket, Type};
use std::net::{IpAddr, SocketAddr};
use std::path::PathBuf;
use tauri::Manager;

#[derive(serde::Serialize)]
pub struct NetworkInfo {
    source_ip: Option<String>,
    subnet_mask: Option<String>,
    gateway: Option<String>,
    interface_name: Option<String>,
}

fn devices_path(app: &tauri::AppHandle) -> PathBuf {
    app.path().app_data_dir().unwrap().join("devices.json")
}

/// Parse MAC address from string format
fn parse_mac_address(mac_str: &str) -> Result<[u8; 6], String> {
    let parts: Vec<&str> = mac_str.split(|c| c == ':' || c == '-').collect();
    if parts.len() != 6 {
        return Err("MAC address must have 6 octets".to_string());
    }

    let mut mac = [0u8; 6];
    for (i, part) in parts.iter().enumerate() {
        mac[i] = u8::from_str_radix(part, 16).map_err(|e| format!("Invalid MAC byte: {}", e))?;
    }
    Ok(mac)
}

#[tauri::command]
fn save_devices(app: tauri::AppHandle, devices: String) -> Result<(), String> {
    let path = devices_path(&app);
    println!("[SAVE_DEVICES] Writing to: {:?}", path);
    std::fs::create_dir_all(path.parent().unwrap()).map_err(|e| e.to_string())?;
    std::fs::write(&path, devices).map_err(|e| e.to_string())?;
    println!("[SAVE_DEVICES] Success");
    Ok(())
}

#[tauri::command]
fn load_devices(app: tauri::AppHandle) -> Result<String, String> {
    println!("[LOAD_DEVICES] Loading devices from file");
    let path = devices_path(&app);
    if !path.exists() {
        return Ok("[]".to_string());
    }
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

/// Send Wake-on-LAN packet
#[tauri::command]
fn send_wake_on_lan(mac: String, broadcast_addr: String, port: String) -> Result<String, String> {
    println!(
        "[WOL] MAC: {}, Broadcast: {}, Port: {}",
        mac, broadcast_addr, port
    );

    let mac_address = parse_mac_address(&mac)?;

    // Create magic packet
    let mut magic_packet = vec![0xFF; 6];
    for _ in 0..16 {
        magic_packet.extend_from_slice(&mac_address);
    }

    // Create UDP socket
    let socket = Socket::new(Domain::IPV4, Type::DGRAM, Some(Protocol::UDP))
        .map_err(|e| format!("Failed to create socket: {}", e))?;

    socket
        .set_broadcast(true)
        .map_err(|e| format!("Failed to enable broadcast: {}", e))?;

    let addr: SocketAddr = SocketAddr::new(
        broadcast_addr
            .parse()
            .map_err(|e| format!("Failed to parse IP: {}", e))?,
        port.parse::<u16>()
            .map_err(|e| format!("Failed to parse port: {}", e))?,
    );

    socket
        .send_to(&magic_packet, &addr.into())
        .map_err(|e| format!("Failed to send packet: {}", e))?;

    Ok("WOL packet sent".to_string())
}

/// Collect network information
#[tauri::command]
fn get_network_info() -> NetworkInfo {
    use if_addrs::get_if_addrs;

    let mut source_ip = None;
    let mut subnet_mask = None;
    let mut interface_name = None;

    if let Ok(ifaces) = get_if_addrs() {
        for iface in ifaces {
            // Skip loopback
            if iface.is_loopback() {
                continue;
            }
            if let IpAddr::V4(ip) = iface.ip() {
                source_ip = Some(ip.to_string());
                interface_name = Some(iface.name.clone());
                // Calculate subnet mask from prefix
                if let if_addrs::IfAddr::V4(ref v4) = iface.addr {
                    subnet_mask = Some(v4.netmask.to_string());
                }
                break;
            }
        }
    }

    NetworkInfo {
        source_ip,
        subnet_mask,
        gateway: None,
        interface_name,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            send_wake_on_lan,
            get_network_info,
            save_devices,
            load_devices
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
