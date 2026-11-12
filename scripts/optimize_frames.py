import os
import glob
import time
from concurrent.futures import ProcessPoolExecutor, as_completed
from PIL import Image

SRC_DIR = "public/hero-frames"
WEBP_1080_DIR = "public/hero-frames"
WEBP_720_DIR = "public/hero-frames-mobile"

def process_single_frame(idx):
    padded = f"{idx:03d}"
    src_jpg = os.path.join(SRC_DIR, f"frame_{padded}.jpg")
    if not os.path.exists(src_jpg):
        return None

    # Desktop WebP 1080p (quality 82, method 4 for fast high-quality encoding)
    dst_webp_1080 = os.path.join(WEBP_1080_DIR, f"frame_{padded}.webp")
    # Mobile WebP 720p (1280x720, quality 80)
    dst_webp_720 = os.path.join(WEBP_720_DIR, f"frame_{padded}.webp")

    # If both already exist, skip
    if os.path.exists(dst_webp_1080) and os.path.exists(dst_webp_720):
        return (idx, os.path.getsize(dst_webp_1080), os.path.getsize(dst_webp_720))

    try:
        with Image.open(src_jpg) as img:
            # 1. Save 1080p WebP
            if not os.path.exists(dst_webp_1080):
                img.save(dst_webp_1080, "WEBP", quality=82, method=4)

            # 2. Save 720p Mobile WebP
            if not os.path.exists(dst_webp_720):
                img_720 = img.resize((1280, 720), Image.Resampling.LANCZOS)
                img_720.save(dst_webp_720, "WEBP", quality=80, method=4)

        s_1080 = os.path.getsize(dst_webp_1080) if os.path.exists(dst_webp_1080) else 0
        s_720 = os.path.getsize(dst_webp_720) if os.path.exists(dst_webp_720) else 0
        return (idx, s_1080, s_720)
    except Exception as e:
        print(f"Error on frame {idx}: {e}")
        return None

def main():
    os.makedirs(WEBP_720_DIR, exist_ok=True)
    total_frames = 850

    print(f"Starting conversion of {total_frames} frames to 1080p and 720p WebP...")
    t0 = time.time()

    workers = min(os.cpu_count() or 4, 8)
    completed = 0
    total_1080_bytes = 0
    total_720_bytes = 0

    with ProcessPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(process_single_frame, i): i for i in range(1, total_frames + 1)}
        for future in as_completed(futures):
            res = future.result()
            if res:
                completed += 1
                total_1080_bytes += res[1]
                total_720_bytes += res[2]
                if completed % 100 == 0 or completed == total_frames:
                    elapsed = time.time() - t0
                    print(f"[{completed}/{total_frames}] frames converted in {elapsed:.1f}s ({completed/elapsed:.1f} fps)")

    t1 = time.time()
    print("=== CONVERSION COMPLETE ===")
    print(f"Total time: {t1-t0:.2f}s")
    print(f"Total 1080p WebP size: {total_1080_bytes / (1024*1024):.2f} MB")
    print(f"Total 720p Mobile WebP size: {total_720_bytes / (1024*1024):.2f} MB")

if __name__ == "__main__":
    main()

