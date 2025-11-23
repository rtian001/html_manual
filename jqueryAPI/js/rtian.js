var query=location.hash.substring(1);
	$("#content a").click(function(){
		var a=$(this).attr("href"),
			b=a.substr(0,1),
			c=a.substr(0,4);

		if (c != "http" && b != "#"){//*******普通链接转换ajax
			$(this).attr("href","#" + a);
			$("#content_main").load(a,function(){
				$("title").text($("#content_box title").text());
				//******定位到页内锚点*********
				if (a.indexOf("#") > 1){
					var a1=a.split("#");
					$("#content_box").mCustomScrollbar("scrollTo",$("#" + a1[1]));
				}else{
					$("#content_box").mCustomScrollbar("scrollTo","top");
				}
				//**************
				$(this).attr("href", a);
			});
		}else if (b == "#"){//*********定位到本页内锚点javascript:void(0)
			var $this=$(this);
			$this.attr("href","javascript:void(0)");
			$this.attr("pot",a.substring(1));
			var pot=$this.attr("pot");
			$("#content_box").mCustomScrollbar("scrollTo",$("#" +pot),function(){$this.attr("href",a);});
		}
	});
	buildDemos();
   function buildDemos() {
        $( ".entry-example" ).each(function() {
            		var iframeSrc,
            			src = $( this ).find( ".syntaxhighlighter" ),
            			output = $( this ).find( ".code-demo" );

            		if ( !src.length || !output.length ) {
            			return;
            		}

            		// Get the original source
            		iframeSrc = src.find( "td.code .line" ).map(function() {
            			// Convert non-breaking spaces from highlighted code to normal spaces
            			return $( this ).text().replace( /\xa0/g, " " );
            		// Restore new lines from original source
            		}).get().join( "\n" );

            		iframeSrc = iframeSrc
            			// Insert styling for the live demo that we don't want in the
            			// highlighted code
            			.replace( "</head>",
            				"<style>" +
            					"html, body { border:0; margin:0; padding:0; }" +
            					"body { font-family: 'Helvetica', 'Arial',  'Verdana', 'sans-serif'; }" +
            				"</style>" +
            				"</head>" )
            			// IE <10 executes scripts in the order in which they're loaded,
            			// not the order in which they're written. So we need to defer inline
            			// scripts so that scripts which need to be fetched are executed first.
            			.replace( /<script>([\s\S]+)<\/script>/,
            				"<script>" +
            				"window.onload = function() {" +
            					"$1" +
            				"};" +
            				"</script>" );

            		var iframe = document.createElement( "iframe" );
            		iframe.width = "100%";
            		iframe.height = output.attr( "data-height" ) || 250;
            		output.append( iframe );

            		var doc = (iframe.contentWindow || iframe.contentDocument).document;
            		doc.write( iframeSrc );
            		doc.close();
            	});
    } 