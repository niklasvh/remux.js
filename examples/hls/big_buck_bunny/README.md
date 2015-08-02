# Big Buck Bunny

[https://peach.blender.org/trailer-page/](Download)

# Encoding hls streams

    INPUT="trailer_1080p.mov"

    AUDIO_OPTS1="-c:a aac -strict experimental -ac 2 -b:a 64k -ar 44100"
    AUDIO_OPTS2="-c:a aac -strict experimental -ac 2 -b:a 96k -ar 44100"

    VIDEO_OPTS1="-c:v libx264 -pix_fmt yuv420p -profile:v baseline -level 41 -b:v 400K -r 24 -g 72 -keyint_min 60"
    VIDEO_OPTS2="-c:v libx264 -pix_fmt yuv420p -profile:v baseline -level 41 -b:v 600K -r 24 -g 72 -keyint_min 60"
    VIDEO_OPTS3="-c:v libx264 -pix_fmt yuv420p -profile:v baseline -level 41 -b:v 1500K -r 24 -g 72 -keyint_min 60"
    VIDEO_OPTS4="-c:v libx264 -pix_fmt yuv420p -profile:v baseline -level 41 -b:v 2500K -r 24 -g 72 -keyint_min 60"

    HLS_OPTS="-f hls -hls_time 2 -hls_list_size 100 -hls_wrap 30"

    ffmpeg -y -i trailer_1080p.mov \
        $AUDIO_OPTS1 $VIDEO_OPTS1 $HLS_OPTS -s 480x270 480x270.m3u8 \
        $AUDIO_OPTS2 $VIDEO_OPTS2 $HLS_OPTS -s 640x360 640x360.m3u8 \
        $AUDIO_OPTS2 $VIDEO_OPTS3 $HLS_OPTS -s 1280x720 1280x720.m3u8 \
        $AUDIO_OPTS2 $VIDEO_OPTS4 $HLS_OPTS -s 1920x1080 1920x1080.m3u8

    // ['ffmpeg -y -i', INPUT, '-pass 1 -an', VIDEO_OPTS4, HLS_OPTS, '-s 1920x1080 1920x1080.m3u8'].join(' ');
    // ['ffmpeg -y -i', INPUT, '-pass 2', AUDIO_OPTS1, VIDEO_OPTS1, HLS_OPTS,'-s 480x270 480x270.m3u8', AUDIO_OPTS2, VIDEO_OPTS2, HLS_OPTS,'-s 640x360 640x360.m3u8', AUDIO_OPTS2, VIDEO_OPTS3, HLS_OPTS, '-s 1280x720 1280x720.m3u8', AUDIO_OPTS2, VIDEO_OPTS4, HLS_OPTS, '-s 1920x1080 1920x1080.m3u8'].join(' ')
