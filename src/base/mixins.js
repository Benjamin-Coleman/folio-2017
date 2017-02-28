// fontSize(contextWidth, $base-font-size, $min-width, $max-width) {
//
// 	$min-size = round($min-width * ($base-font-size / $context-width)) / 10;
// 	$max-size = round($max-width * ($base-font-size / $context-width)) / 10;
//
// 	@media screen and (max-width: ($min-width)px) {
//    @media screen and (max-width: ($min-width)px) {
//      font-size: $min-size;
//    }
//   }
//
//  @media screen and (min-width: ($min-width)px) {
//    @media screen and (max-width: ($max-width)px) {
//      font-size: (($base-font-size / $context-width) * 100)vw;
//    }
//   }
//
//  @media screen and (min-width: ($max-width)px) {
//    @media screen and (min-width: ($max-width)px) {
//      font-size: $max-size;
//    }
//   }
//
// }

module.exports = {
	fontSize: function (mixin, baseFontSize, contextWidth ) {

		const size = (baseFontSize / contextWidth) * 100;

		return {
				'font-size': size + 'vw',
				'line-height': size + 'vw'
		}
	}
}
