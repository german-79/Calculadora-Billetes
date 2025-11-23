import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colores from '../estilos/colores';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GAP = 8;              // espacio entre botones
const H_PADDING = 12;       // padding horizontal de la grilla
const COLS = 4;
const ROWS = 4;

// área disponible DENTRO de la grilla
const usableWidth = SCREEN_WIDTH - H_PADDING * 2;
const colWidth = (usableWidth - GAP * (COLS - 1)) / COLS;
const rowHeight = colWidth * 1.0; // botones cuadrados

const Bot = ({ label, onPress, style, textStyle }) => (
    <TouchableOpacity
        style={[styles.boton, style]}
        onPress={() => onPress(label)}
        activeOpacity={0.7}
    >
        <Text style={[styles.botonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
);

export default function TecladoPOS({ onKey }) {
    return (
        <View style={styles.grid}>

            {/* FILA 1 */}
            <Bot label="7" onPress={onKey} style={[styles.baseBtn, pos(0, 0)]} />
            <Bot label="8" onPress={onKey} style={[styles.baseBtn, pos(1, 0)]} />
            <Bot label="9" onPress={onKey} style={[styles.baseBtn, pos(2, 0)]} />
            <Bot label="DEL" onPress={onKey} style={[styles.baseBtn, pos(3, 0), styles.btnDel]} />

            {/* FILA 2 */}
            <Bot label="4" onPress={onKey} style={[styles.baseBtn, pos(0, 1)]} />
            <Bot label="5" onPress={onKey} style={[styles.baseBtn, pos(1, 1)]} />
            <Bot label="6" onPress={onKey} style={[styles.baseBtn, pos(2, 1)]} />

            {/* "+" ocupa 2 filas: fila 2 y fila 3 */}
            <Bot
                label="+"
                onPress={onKey}
                style={[styles.baseBtn, pos(3, 1, 1, 2), styles.btnPlus]}
            />

            {/* FILA 3 */}
            <Bot label="1" onPress={onKey} style={[styles.baseBtn, pos(0, 2)]} />
            <Bot label="2" onPress={onKey} style={[styles.baseBtn, pos(1, 2)]} />
            <Bot label="3" onPress={onKey} style={[styles.baseBtn, pos(2, 2)]} />
            {/* el + ya ocupa col3 aquí */}

            {/* FILA 4 */}
            <Bot label="0" onPress={onKey} style={[styles.baseBtn, pos(0, 3)]} />

            {/* OK ocupa 3 columnas (col 1–3) */}
            <Bot
                label="OK"
                onPress={onKey}
                style={[
                    styles.baseBtn,
                    pos(1, 3, 3, 1),
                    styles.btnOK
                ]}
                textStyle={{ color: '#fff', fontWeight: '800' }}
            />

        </View>
    );
}


/* CÁLCULO DE POSICIÓN SIN PADDING EXTRA */
function pos(col, row, colSpan = 1, rowSpan = 1) {

    // NO SUMAMOS H_PADDING → ya está en el grid
    const left = col * (colWidth + GAP);
    const top = row * (rowHeight + GAP);

    const width = colWidth * colSpan + GAP * (colSpan - 1);
    const height = rowHeight * rowSpan + GAP * (rowSpan - 1);

    return {
        position: 'absolute',
        left,
        top,
        width,
        height
    };
}

const styles = StyleSheet.create({
    grid: {
        width: '100%',
        paddingHorizontal: H_PADDING,
        height: rowHeight * ROWS + GAP * (ROWS - 1),
        marginTop: 10,
    },

    boton: {
        position: 'absolute',
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },

    baseBtn: {
        backgroundColor: '#FAFAFA',
    },

    botonText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
    },

    btnDel: {
        backgroundColor: '#F7D7D7',
    },

    btnPlus: {
        backgroundColor: '#E9F2FF',
    },

    btnOK: {
        backgroundColor: colores.primario,
    },
});
